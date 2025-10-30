import Tesseract from 'tesseract.js';
import OpenAI from 'openai';
import sharp from 'sharp';
import { OCRResult } from '@expense-claims/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OCRService {
  async processReceipt(fileBuffer: Buffer, mimeType: string): Promise<OCRResult> {
    try {
      let imageBuffer = fileBuffer;

      if (mimeType === 'application/pdf') {
        return { success: false, error: 'PDF processing requires specialized service' };
      }

      imageBuffer = await this.preprocessImage(fileBuffer);

      const ocrText = await this.extractTextFromImage(imageBuffer);

      const parsedData = await this.parseReceiptWithAI(ocrText);

      return {
        success: true,
        data: parsedData,
        confidence: this.calculateConfidence(parsedData),
        rawText: ocrText,
      };
    } catch (error: any) {
      console.error('OCR processing error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async preprocessImage(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .greyscale()
      .normalize()
      .sharpen()
      .toBuffer();
  }

  private async extractTextFromImage(imageBuffer: Buffer): Promise<string> {
    const { data } = await Tesseract.recognize(imageBuffer, 'ind+eng', {
      logger: (m) => console.log(m),
    });
    return data.text;
  }

  private async parseReceiptWithAI(text: string): Promise<any> {
    const prompt = `
Extract structured data from this receipt text. Return a JSON object with the following fields:
- date (ISO 8601 format)
- amount (number, total amount)
- vendor (string, merchant/vendor name)
- category (string, one of: MEAL, TRANSPORTATION, ACCOMMODATION, ENTERTAINMENT, EQUIPMENT, OTHER)
- items (array of {description, quantity, unitPrice, amount})
- taxAmount (number)
- taxRate (number, percentage)
- total (number)
- currency (string, default IDR)

Receipt text:
${text}

Return only valid JSON, no additional text.
`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at extracting structured data from receipts and invoices. Always return valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (error) {
      console.error('AI parsing error:', error);
      return this.fallbackParsing(text);
    }
  }

  private fallbackParsing(text: string): any {
    const amountMatch = text.match(/(?:Rp|IDR|USD|SGD|EUR)?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/);
    const dateMatch = text.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);

    return {
      date: dateMatch ? dateMatch[1] : null,
      amount: amountMatch ? parseFloat(amountMatch[1].replace(/[.,]/g, '')) : null,
      vendor: null,
      category: 'OTHER',
      currency: 'IDR',
    };
  }

  private calculateConfidence(data: any): number {
    let score = 0;
    let total = 0;

    const fields = ['date', 'amount', 'vendor', 'category'];
    fields.forEach((field) => {
      total += 25;
      if (data[field] && data[field] !== null) {
        score += 25;
      }
    });

    return total > 0 ? Math.round((score / total) * 100) : 0;
  }

  async processReceiptWithVision(fileBuffer: Buffer): Promise<OCRResult> {
    try {
      const base64Image = fileBuffer.toString('base64');

      const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract all information from this receipt/invoice image and return as JSON with fields:
- date (ISO 8601)
- amount (number)
- vendor (string)
- category (MEAL/TRANSPORTATION/ACCOMMODATION/ENTERTAINMENT/EQUIPMENT/OTHER)
- items (array)
- taxAmount (number)
- taxRate (number)
- total (number)
- currency (string)`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content || '{}';
      const data = JSON.parse(content);

      return {
        success: true,
        data,
        confidence: this.calculateConfidence(data),
      };
    } catch (error: any) {
      console.error('Vision OCR error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const ocrService = new OCRService();

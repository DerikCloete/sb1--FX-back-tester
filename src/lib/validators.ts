import { parse, isValid } from 'date-fns';
import Decimal from 'decimal.js';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: any[];
}

export function validateMarketData(data: any[]): ValidationResult {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      error: 'Invalid data format or empty dataset',
    };
  }

  const requiredFields = ['timestamp', 'open', 'high', 'low', 'close', 'volume'];
  const validatedData = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Check required fields
    for (const field of requiredFields) {
      if (!(field in row)) {
        return {
          isValid: false,
          error: `Missing required field: ${field} at row ${i + 1}`,
        };
      }
    }

    // Validate timestamp
    const timestamp = typeof row.timestamp === 'string' 
      ? parse(row.timestamp, 'yyyy-MM-dd HH:mm:ss', new Date())
      : new Date(row.timestamp);

    if (!isValid(timestamp)) {
      return {
        isValid: false,
        error: `Invalid timestamp at row ${i + 1}`,
      };
    }

    // Validate numeric values
    const numericFields = ['open', 'high', 'low', 'close', 'volume'];
    const validatedRow: any = {
      timestamp: timestamp.getTime(),
    };

    for (const field of numericFields) {
      try {
        const value = new Decimal(row[field]);
        if (field !== 'volume' && value.isNegative()) {
          return {
            isValid: false,
            error: `${field} cannot be negative at row ${i + 1}`,
          };
        }
        validatedRow[field] = value.toNumber();
      } catch (err) {
        return {
          isValid: false,
          error: `Invalid ${field} value at row ${i + 1}`,
        };
      }
    }

    // Validate price relationships
    if (validatedRow.high < validatedRow.low ||
        validatedRow.open < validatedRow.low ||
        validatedRow.open > validatedRow.high ||
        validatedRow.close < validatedRow.low ||
        validatedRow.close > validatedRow.high) {
      return {
        isValid: false,
        error: `Invalid price relationships at row ${i + 1}`,
      };
    }

    validatedData.push(validatedRow);
  }

  // Sort data by timestamp
  validatedData.sort((a, b) => a.timestamp - b.timestamp);

  return {
    isValid: true,
    data: validatedData,
  };
}
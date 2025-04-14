// src/app/utils/security.ts
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

export const sanitize = {
  // Sanitize text input to prevent XSS
  string: (input: string | undefined | null): string => {
    if (!input) return '';
    return DOMPurify.sanitize(input.trim());
  },

  // Sanitize and validate number input
  number: (input: string | number | undefined | null): number => {
    if (input === undefined || input === null) return 0;
    const str = typeof input === 'number' ? input.toString() : input;
    return validator.isNumeric(str || '') ? Number(str) : 0;
  },

  // Sanitize and validate email
  email: (input: string | undefined | null): string => {
    if (!input) return '';
    const sanitized = DOMPurify.sanitize(input.trim());
    return validator.isEmail(sanitized) ? sanitized : '';
  },

  // Escape HTML special characters
  escapeHtml: (input: string | undefined | null): string => {
    if (!input) return '';
    return validator.escape(input.trim());
  }
};

// Custom validation rules
export const validate = {
  isNotEmpty: (input: string | undefined | null): boolean => {
    return input !== undefined && input !== null && input.trim() !== '';
  },

  isValidCode: (input: string | undefined | null): boolean => {
    if (!input) return false;
    // Example pattern: alphanumeric, underscores, hyphens, 3-20 characters
    return validator.matches(input, /^[a-zA-Z0-9_-]{3,20}$/);
  }
};
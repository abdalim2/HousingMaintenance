import { NextRequest, NextResponse } from 'next/server';

interface ProcessedItem {
  arabicName: string;
  englishName: string;
  category: string;
  unit: string;
  imageUrl: string;
}

// Helper function to get common units based on category
const getCommonUnit = (category: string): string => {
  const categoryMap: { [key: string]: string } = {
    'أدوات كهربائية': 'قطعة',
    'أدوات سباكة': 'قطعة',
    'مواد بناء': 'كيس',
    'دهانات': 'جالون',
    'أدوات نجارة': 'قطعة',
    'مواد تنظيف': 'عبوة',
    'أدوات صيانة': 'قطعة',
    'أجهزة كهربائية': 'جهاز',
    'معدات': 'قطعة',
  };

  return categoryMap[category] || 'قطعة';
};

// Helper function to categorize items
const categorizeItem = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();

  if (/مفتاح|مصباح|كابل|سلك|انارة|لمبة|فيش|ليد/.test(lowerName)) {
    return 'أدوات كهربائية';
  } else if (/حنفية|خلاط|محبس|مواسير|صنبور|سيفون|مرحاض/.test(lowerName)) {
    return 'أدوات سباكة';
  } else if (/اسمنت|طوب|خرسانة|جبس|رمل/.test(lowerName)) {
    return 'مواد بناء';
  } else if (/دهان|طلاء|لاكيه|بوية|ورنيش/.test(lowerName)) {
    return 'دهانات';
  } else if (/مسامير|خشب|قشرة|لوح|مفك/.test(lowerName)) {
    return 'أدوات نجارة';
  } else if (/منظف|صابون|معطر|كلور|مطهر/.test(lowerName)) {
    return 'مواد تنظيف';
  } else if (/مفتاح|مطرقة|كماشة|عدة|أداة|مفك/.test(lowerName)) {
    return 'أدوات صيانة';
  } else if (/تلفاز|ثلاجة|غسالة|مكيف|فرن|سخان/.test(lowerName)) {
    return 'أجهزة كهربائية';
  }

  return 'معدات';
};

// Helper to generate image URL (using placeholder images for now)
const getImageUrl = (item: string): string => {
  // Generate a placeholder image based on the item name's first letter
  const firstLetter = item.trim().charAt(0).toUpperCase();
  return `https://via.placeholder.com/150/3498db/ffffff?text=${encodeURIComponent(firstLetter)}`;
};

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    // Parse the file content - assuming one item per line
    const lines = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);

    // Process each line to create item entries
    const items: ProcessedItem[] = lines.map((line: string) => {
      const arabicName = line.trim();
      let englishName = '';

      // Generate a simple transliteration for English name
      // This is a simplified version - in a production app you'd use a proper transliteration library
      const transliterationMap: { [key: string]: string } = {
        ا: 'a',
        ب: 'b',
        ت: 't',
        ث: 'th',
        ج: 'j',
        ح: 'h',
        خ: 'kh',
        د: 'd',
        ذ: 'th',
        ر: 'r',
        ز: 'z',
        س: 's',
        ش: 'sh',
        ص: 's',
        ض: 'd',
        ط: 't',
        ظ: 'z',
        ع: 'a',
        غ: 'gh',
        ف: 'f',
        ق: 'q',
        ك: 'k',
        ل: 'l',
        م: 'm',
        ن: 'n',
        ه: 'h',
        و: 'w',
        ي: 'y',
      };

      // Generate a simple English name version - this is just a placeholder
      englishName = arabicName
        .split('')
        .map((char) => transliterationMap[char] || char)
        .join('')
        .replace(/\s+/g, ' ');

      // Categorize the item based on its name
      const category = categorizeItem(arabicName);

      // Get common unit based on category
      const unit = getCommonUnit(category);

      // Generate placeholder image URL
      const imageUrl = getImageUrl(arabicName);

      return {
        arabicName,
        englishName,
        category,
        unit,
        imageUrl,
      };
    });

    return NextResponse.json(
      {
        success: true,
        items,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing inventory file:', error);
    return NextResponse.json(
      {
        error: 'Failed to process file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
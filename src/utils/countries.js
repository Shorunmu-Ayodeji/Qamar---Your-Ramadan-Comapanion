// Country data used for profile and social views.
export const COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'EG', name: 'Egypt' },
  { code: 'JO', name: 'Jordan' },
  { code: 'PS', name: 'Palestine' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'SY', name: 'Syria' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'QA', name: 'Qatar' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'OM', name: 'Oman' },
  { code: 'YE', name: 'Yemen' },
  { code: 'MA', name: 'Morocco' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'LY', name: 'Libya' },
  { code: 'TR', name: 'Turkey' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'IN', name: 'India' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'AU', name: 'Australia' },
];

const FALLBACK_FLAG = String.fromCodePoint(0x1F30D);
const DEFAULT_GENDER = String.fromCodePoint(0x2728);

const countryByCode = new Map(COUNTRIES.map((c) => [c.code.toUpperCase(), c]));
const countryByName = new Map(COUNTRIES.map((c) => [c.name.toLowerCase(), c]));

const toFlagEmoji = (countryCode) => {
  if (!/^[A-Z]{2}$/.test(countryCode)) return FALLBACK_FLAG;
  const base = 0x1f1e6;
  const a = countryCode.charCodeAt(0) - 65 + base;
  const b = countryCode.charCodeAt(1) - 65 + base;
  return String.fromCodePoint(a, b);
};

const normalizeCountryCode = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const maybeCode = trimmed.toUpperCase();
  if (countryByCode.has(maybeCode)) {
    return maybeCode;
  }

  const byName = countryByName.get(trimmed.toLowerCase());
  if (byName) {
    return byName.code;
  }

  if (/^[A-Z]{2}$/.test(maybeCode)) {
    return maybeCode;
  }

  return null;
};

const flagCache = new Map();

export const getCountryByCode = (value) => {
  const code = normalizeCountryCode(value);
  if (!code) return null;

  if (flagCache.has(code)) {
    return flagCache.get(code);
  }

  const country = countryByCode.get(code);
  let result;
  if (country) {
    result = { ...country, flag: toFlagEmoji(code) };
  } else {
    let name = code;
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      name = regionNames.of(code) || code;
    } catch (e) {
      // Fallback to code if Intl is not supported
    }
    result = { code, name, flag: toFlagEmoji(code) };
  }

  flagCache.set(code, result);
  return result;
};

export const getCountryFlag = (value) => {
  const code = normalizeCountryCode(value);
  return code ? toFlagEmoji(code) : FALLBACK_FLAG;
};

// Gender selections used by profile and social cards.
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', emoji: String.fromCodePoint(0x1F468) },
  { value: 'female', label: 'Female', emoji: String.fromCodePoint(0x1F469) },
  { value: 'other', label: 'Other', emoji: String.fromCodePoint(0x1F9D1) },
  { value: 'prefer-not', label: 'Prefer not to say', emoji: DEFAULT_GENDER },
];

export const getGenderEmoji = (gender) => {
  const option = GENDER_OPTIONS.find((o) => o.value === gender);
  return option ? option.emoji : DEFAULT_GENDER;
};

export const searchCountries = (query) => {
  const term = query?.toLowerCase().trim();
  const matches = term
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.code.toLowerCase().includes(term)
      )
    : COUNTRIES;

  return matches.map((c) => ({
    ...c,
    flag: toFlagEmoji(c.code),
  }));
};

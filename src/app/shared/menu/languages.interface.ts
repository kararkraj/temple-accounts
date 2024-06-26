export interface Language {
    language: string;
    iconName: string;
    isSelected: boolean;
    langCode: string;
}

export const LANGUAGES: Language[] = [
    {
        language: 'English',
        iconName: 'checkmark-outline',
        isSelected: true,
        langCode: "en"
    },
    {
        language: 'Kannada',
        iconName: 'checkmark-outline',
        isSelected: false,
        langCode: "kn"
    }
];
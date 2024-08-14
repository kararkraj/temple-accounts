export const STORAGE_KEYS = {
    AUTH: {
        isAuthenticated: "isAuthenticated"
    },
    ENTRY: {
        entries: "entries",
        lastStoredId: "lastStoredEntryId"
    },
    TEMPLE: {
        temples: "temples"
    },
    CHARITY_TYPES: {
        charityTypes: "charityTypes",
        lastStoredId: "lastStoredCharityTypeId"
    }
}

export const DEFAULT_STORAGE_VALUES = {
    [STORAGE_KEYS.AUTH.isAuthenticated]: false,
    [STORAGE_KEYS.ENTRY.entries]: [],
    [STORAGE_KEYS.ENTRY.lastStoredId]: 0,
    [STORAGE_KEYS.CHARITY_TYPES.charityTypes]: [],
    [STORAGE_KEYS.CHARITY_TYPES.lastStoredId]: 0
}
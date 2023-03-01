
type RecursiveMap<T> = {
    [key: string]: T | RecursiveMap<T>
}

type I18NConfig = {
    locales: [string],
    curLocale: string,
    values: RecursiveMap<string>
}

export type EditorConfig = {
    i18n: I18NConfig,
}

export let DefaultConfig: EditorConfig = {
    i18n: {
        locales: ["de"],
        curLocale: "de",
        values: {
            "de": {
                "num": "Zahl",
                "bool": "Wahrheitswert",
                "values": "Werte",
                "value": "Wert",
                "operators": "Operatoren",
                "add": "Summe",
                "mult": "Produkt",
                "addIn": "Summand",
                "multIn": "Faktor",
                "res": "Ergebnis",
                "greater": "A>B",
                "equal": "A=B",
                "sub": "Differenz",
                "subIn": "Minuend",
                "subIn2": "Subtrahend",
                "processes": "Prozesse",
                "process": "Prozess",
                "processSelector": "Prozess-Auswahl",
                "cond": "Bedingung",
                "if": "Falls",
                "else": "Sonst",
                "numIn": "Eingabe - Zahl",
                "numOut": "Ausgabe - Zahl",
                "controlflow": "Kontroll-Fluss"
            }
        }
    }
}
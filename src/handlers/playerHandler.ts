import { SquareData } from "./boardHandler";

export interface Player {
    id: number
    name: string
    color: string
    hasTurn: boolean
    markers: Marker[]
    moveList: string[]
}

export interface Marker {
    id: number,
    square?: SquareData
    finished?: boolean
}

export const playerOne:Player = {
    id: 1,
    name: "Kalle",
    color: "red",
    hasTurn: true,
    markers: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
    ],
    moveList: [
        "A4",
        "A3",
        "A2",
        "A1",
        "B1",
        "B2",
        "B3",
        "B4", 
        "B5",
        "B6",
        "B7",
        "B8",
        "A8",
        "A7"
    ]
}

export const playerTwo:Player = {
    id: 2,
    name: "Pelle",
    color: "blue",
    hasTurn: false,
    markers: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 }
    ],
    moveList: [
        "C4",
        "C3",
        "C2",
        "C1",
        "B1",
        "B2",
        "B3",
        "B4", 
        "B5",
        "B6",
        "B7",
        "B8",
        "C8",
        "C7"
    ]
}

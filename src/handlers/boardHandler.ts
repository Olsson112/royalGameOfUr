import { Player } from './playerHandler'

export interface SquareData {
    id: string
    extraTurn?: boolean 
}

export const gameBoard: SquareData[] = [
    {id: "A1", extraTurn: true},
    {id: "A2"},
    {id: "A3"},
    {id: "A4"},
    {id: "A5"},
    {id: "A6"},
    {id: "A7", extraTurn: true},
    {id: "A8"},
    {id: "B1"},
    {id: "B2"},
    {id: "B3"},
    {id: "B4", extraTurn: true},
    {id: "B5"},
    {id: "B6"},
    {id: "B7"},
    {id: "B8"},
    {id: "C1", extraTurn: true},
    {id: "C2"},
    {id: "C3"},
    {id: "C4"},
    {id: "C5"},
    {id: "C6"},
    {id: "C7", extraTurn: true},
    {id: "C8"},
]

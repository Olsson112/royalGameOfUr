import { Player, Marker } from './playerHandler'
import Lodash from 'lodash'
import { gameBoard, SquareData } from './boardHandler';
import GameBoard from '../components/gameBoard';

function move(playerToMove: Player, otherPlayer: Player, newPosition: SquareData, markerToMove: Marker) {

    //let markerToMove: Marker | undefined = playerToMove.markers.find((marker) => marker.id == marker.id)

    // Ta bort marker om konflikt hittas
    otherPlayer.markers.forEach((marker) => {
        if (marker.square && marker.square.id == newPosition.id) {
            delete marker.square
        }
    })

    // Uppdatera marker som skall flyttas 
    playerToMove.markers.forEach((marker) => {
        if (marker.id == markerToMove.id) {
            marker.square = newPosition
        }
    })

    if (!newPosition.extraTurn) {
        playerToMove.hasTurn = false
        otherPlayer.hasTurn = true
    }
    
    return { playerToMove, otherPlayer }
}

export function validateMove(playerToMove: Player, otherPlayer: Player, stepAmount: number, marker: Marker) {
    let newPosition: SquareData = gameBoard[0]
    
    const playerToMoveMarkersOnBoard = playerToMove.markers.filter((marker) => !!marker.square)
    const otherPlayersMarkersOnBoard = otherPlayer.markers.filter((marker) => !!marker.square)

    // Förflyttningen går ej om markern går över mål.. Går ut med markern om stegen är rätt till mål.
    if (marker.square) {
        const currentMarkerIndexPosition = playerToMove.moveList.findIndex((position) => position == marker.square!.id)
        if ((currentMarkerIndexPosition + stepAmount) == playerToMove.moveList.length) {
            console.log("Markern går ut!")
            playerToMove.markers.forEach(markerToUpdate => {
                if (markerToUpdate.id == marker.id) {
                    markerToUpdate.square = undefined
                    markerToUpdate.finished = true
                }
            });
            playerToMove.hasTurn = !playerToMove.hasTurn
            otherPlayer.hasTurn = !otherPlayer.hasTurn
            return { playerToMove, otherPlayer }
        } else if ((currentMarkerIndexPosition + stepAmount) > playerToMove.moveList.length) {
            console.log("För långt")
            return undefined
        } else {
            newPosition = Lodash(gameBoard).find((square) => square.id == playerToMove.moveList[currentMarkerIndexPosition + stepAmount]) as SquareData
        }
    } 
    if (!marker.square) {
        newPosition = Lodash(gameBoard).find((square) => square.id == playerToMove.moveList[stepAmount - 1]) as SquareData  
    }
    
    // Om det finns en annan marker ifrån motspelaren på en "Extra turn" skall nästa square kollas
    if (newPosition.extraTurn) {
        const markerExists: Marker | undefined = otherPlayersMarkersOnBoard.find((markerToCheck) => {
            if(markerToCheck.square) {
                if (markerToCheck.square.id == newPosition.id) {
                    return markerToCheck
                }
            }
        })

        if (markerExists) {
            console.log("Det finns en fiendes marker på specialsquare. Väljer nästa square!")
            const nextSquareIndex = playerToMove.moveList.findIndex((position) => position == markerExists.square!.id) + 1
            newPosition = gameBoard.find((square) => {
                return square.id == playerToMove.moveList[nextSquareIndex]
            }) as SquareData
        }
    }
    
    // Om det finns en egen marker på platsen du försöker flytta till går det ej
    if(Lodash(playerToMoveMarkersOnBoard).find(marker => marker.square!.id == newPosition.id)) {
        console.log("Det finns en egen marker på ny plats")
        return undefined
    }
    
    return move(playerToMove, otherPlayer, newPosition, marker)
}

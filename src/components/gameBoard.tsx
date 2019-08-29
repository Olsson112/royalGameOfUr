import React from 'react'
import cloneDeep from 'lodash/cloneDeep'
import Lodash from 'lodash'
import GameSquare from './gameSquare'
import { gameBoard, SquareData } from '../handlers/boardHandler'
import { Player, playerOne, playerTwo, Marker } from '../handlers/playerHandler'
import { validateMove } from '../handlers/moveHandler'

interface State {
    playerOne: Player
    playerTwo: Player
    stepAmount: number | undefined
    feedbackText: string
    diceResultToShow: number | undefined
}   


export default class GameBoard extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = {
            playerOne: playerOne,
            playerTwo: playerTwo,
            stepAmount: undefined,
            feedbackText: "roll the dice!",
            diceResultToShow: undefined
        }
    }

    private get players() {
        const players: {playerToMove: Player, otherPlayer: Player} = {
            playerToMove: this.state.playerOne.hasTurn ? cloneDeep(this.state.playerOne) : cloneDeep(this.state.playerTwo),
            otherPlayer: this.state.playerTwo.hasTurn ? cloneDeep(this.state.playerOne) : cloneDeep(this.state.playerTwo)
        }
        return players
    }

    private checkForWinner(moveResult: { playerToMove: Player, otherPlayer: Player }) {
        const playerToMoveHasWon: boolean = !Lodash(moveResult.playerToMove.markers).find(marker => !marker.finished)
        const otherPlayerHasWon: boolean = !Lodash(moveResult.otherPlayer.markers).find(marker => !marker.finished)
    
        let winner: Player | undefined = playerToMoveHasWon ? moveResult.playerToMove : otherPlayerHasWon ? moveResult.otherPlayer : undefined

        if(winner) {
            return "has won, congrats!"
        } else {
            return "roll the dice!"
        }
    }

    private moveMarker = (marker: Marker) => {
        if (!this.state.stepAmount) {
            return
        }

        const players = this.players
        const moveResult: { playerToMove: Player, otherPlayer: Player } | undefined = validateMove(players.playerToMove, players.otherPlayer, this.state.stepAmount!, marker)
        
        if(moveResult) {
            const winner = this.checkForWinner(moveResult)
            this.setState({
                playerOne: winner == "has won, congrats!" ? playerOne : players.playerToMove.id == 1 ? moveResult.playerToMove : moveResult.otherPlayer,
                playerTwo: winner == "has won, congrats!" ? playerTwo : players.playerToMove.id == 2 ? moveResult.playerToMove : moveResult.otherPlayer,
                stepAmount: undefined,
                feedbackText: winner,
                diceResultToShow: undefined
            }, () => {console.log(this.state)})
        } else {
            return
        }
    }

    private get moveNewButton() {
        const playerToMove = this.players.playerToMove
        const firstUnusedMarker: Marker | undefined = Lodash(playerToMove.markers).find(marker => !!!marker.square && !marker.finished)
        const canMoveNew = firstUnusedMarker && this.state.stepAmount != undefined
        const className = canMoveNew ? "ui big button " + playerToMove.color : "ui big button disabled " + playerToMove.color
        const callMove = canMoveNew ? () => { this.moveMarker(firstUnusedMarker!) } : () => { console.log("Inga markers kvar") }

        return (
            <React.Fragment>
                <button className={ className } onClick={ callMove }>Place new</button>
            </React.Fragment>
        )
    }

    private get diceButton() {
        const className = "ui big button green " + (this.state.stepAmount != undefined ? "disabled" : "") 
        return (
            <React.Fragment>
                <button className={ className } onClick={ () => { this.simulateDiceThrow() } }>Throw dices!</button>
            </React.Fragment>
        )
    }

    private get passButton() {
        const players = this.players
        players.playerToMove.hasTurn = false
        players.otherPlayer.hasTurn = true
        return (
            <button 
                className="ui big button" 
                onClick={() => { 
                    this.setState({ 
                        playerOne: players.playerToMove, 
                        playerTwo: players.otherPlayer, 
                        stepAmount: undefined, 
                        diceResultToShow: undefined,
                        feedbackText: "roll the dice!"
                    }) 
                }}>
                    Pass
            </button>
        )
    }

    private simulateDiceThrow() {
        const diceResult = Math.floor(Math.random() * Math.floor(5))
        console.log(diceResult)
        if (diceResult == 0) {
            let playerToMove: Player = this.state.playerOne.hasTurn ? cloneDeep(this.state.playerOne) : cloneDeep(this.state.playerTwo)
            let otherPlayer = playerToMove.id == 1 ? cloneDeep(this.state.playerTwo) : cloneDeep(this.state.playerOne)

            playerToMove.hasTurn = false
            otherPlayer.hasTurn = true

            this.setState({ 
                feedbackText: "hit the dice!",
                stepAmount: undefined,
                diceResultToShow: diceResult,
                playerOne: playerToMove.id == 1 ? playerToMove : otherPlayer,
                playerTwo: playerToMove.id == 2 ? playerToMove : otherPlayer,
            })
        } else {
            this.setState({
                feedbackText: "move marker!",
                stepAmount: diceResult,
                diceResultToShow: diceResult
            })
        }
    }

    private findMarkerOnSquare(squareData: SquareData) {
        const playerOneMarkerSearch = this.state.playerOne.markers.find((marker) => marker.square && marker.square.id === squareData.id)
        const playerTwoMarkerSearch = this.state.playerTwo.markers.find((marker) => marker.square && marker.square.id === squareData.id)
        const foundMarker = playerOneMarkerSearch ? playerOneMarkerSearch : playerTwoMarkerSearch ? playerTwoMarkerSearch : undefined
        const markersPlayer = playerOneMarkerSearch ? this.state.playerOne : playerTwoMarkerSearch ? this.state.playerTwo : undefined

        return foundMarker && markersPlayer ? { player: markersPlayer, marker: foundMarker } : undefined
    }

    private get gameSquares() {
        return gameBoard.map((squareData) => {
            const MarkerAndPlayer: {player: Player, marker: Marker} | undefined = this.findMarkerOnSquare(squareData) 
            return <GameSquare squareData={squareData} markerAndPlayer={MarkerAndPlayer} moveMarker={this.moveMarker}/>
        })
    }

    render() {
        const image = require("./../static/gameBoard.png")
        return (
            <React.Fragment> 
                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-end", marginBottom: "1em"}}>
                    <div style={{width: "30%", display: "flex", justifyContent: "center"}}>
                        { 
                            this.state.playerOne.markers.map((marker) => {
                                if(!marker.finished && !marker.square) {
                                    return (
                                        <div style={{width: "3vw", height: "3vw", borderRadius: "100%", marginRight: "10px", backgroundColor: this.state.playerOne.color}} />
                                    )
                                }
                            })
                        }
                    </div>
                    <div style={{width: "30%", display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <h1 style={{fontSize: "3em", margin: "0.2em"}}>
                            { this.state.diceResultToShow != undefined ? "Dice: " + this.state.diceResultToShow : "-" }
                        </h1>
                        <h1 style={{fontSize: "2em", margin: "1em"}}>
                            <span style={{color: this.players.playerToMove.color, marginRight: "10px"}}>
                                {this.players.playerToMove.color.toUpperCase()}
                            </span>
                            { this.state.feedbackText }
                        </h1> 
                        <div style={style['navigationWrapper']}>
                            { this.moveNewButton }
                            { this.diceButton }
                            { this.passButton }
                        </div>  
                    </div>
                    <div style={{width: "30%", display: "flex", justifyContent: "center"}}>
                        { 
                            this.state.playerTwo.markers.map((marker) => {
                                if(!marker.finished && !marker.square) {
                                    return (
                                        <div style={{width: "3vw", height: "3vw", borderRadius: "100%", marginRight: "10px", backgroundColor: this.state.playerTwo.color}} />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                
                
                <div style={style['gameBoardWrapper']}>
                <img style={style['gameBoardImage']} src={image} alt="">
                </img>
                    <div style={style['gameBoard']}>
                        { this.gameSquares }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const style: { [key: string]: React.CSSProperties } = {
    gameBoardImage: {
        width: "100%"
    },
    gameBoardWrapper: {
        position: "relative",
        display: "flex",
        justifyContent: "center",
        width: "100wv"
    },
    gameBoard: {
        position: "absolute",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        padding: "0% 4.5% 0% 4.5%",
        width: "100%",
        height: "100%"
    },
    navigationWrapper: {
        display: "flex", 
        justifyContent: "space-between",
        marginBottom: "5px"
    }
}

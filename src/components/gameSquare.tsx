import React from 'react'
import { SquareData } from '../handlers/boardHandler'
import { Player, playerOne, playerTwo, Marker } from '../handlers/playerHandler'

interface State {
    
}

interface Props {
    squareData: SquareData
    moveMarker: (marker: Marker) => void
    markerAndPlayer?: {player: Player, marker: Marker}
}

export default class GameSquare extends React.Component<Props, State> {

    private get marker(){
        if(this.props.markerAndPlayer) {
            return (
                <div style={{
                    width: "40%", 
                    height: "40%", 
                    borderRadius: "100%", 
                    backgroundColor: 
                    this.props.markerAndPlayer.player.color, border: "1",
                    borderStyle: "solid",
                    borderColor: "white"
                }} />
            )
        }
    }

    private onclickMarker = () => {
        if(this.props.markerAndPlayer && this.props.markerAndPlayer.player.hasTurn) {
            this.props.moveMarker(this.props.markerAndPlayer.marker)
        }
    }

    render() {

        let player = this.props.markerAndPlayer ? this.props.markerAndPlayer.player : undefined
        let marker = this.props.markerAndPlayer ? this.props.markerAndPlayer.marker : undefined
        
        return (
            <div onClick={this.onclickMarker} style={style['gameSquare']}>
                { this.marker }
            </div>
        )
    }
}


const style: { [key: string]: React.CSSProperties } = {
    gameSquare: {
        display: "flex",
        alignItems: "center", 
        justifyContent: "center",    
        height: "21.3%",
        minWidth: "11%",
        margin: "0.5%"
    },
    squareId: {
        color: "white"
    }
}

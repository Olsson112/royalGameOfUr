import React from 'react'
import Gameboard from './gameBoard'

export default class MainContainer extends React.Component {
    render() {
        return (
            <div style={style["mainContainer"]} className="ui container">
                <Gameboard/>
            </div>
        )
    }
}


const style: { [key: string]: React.CSSProperties } = {
    mainContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "80vw",
        height: "100vh",
        padding: "1em"
    }
}

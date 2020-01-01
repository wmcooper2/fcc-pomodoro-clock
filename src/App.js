import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
class BoxControls extends React.Component{
  render(){
    const { props } = {...this.props};
    return(
      <div className="controls">
        <button 
          onClick={() =>{props.onLeftBtn(props.leftBtnID)}}
          id={props.leftBtnID}
          >
          {props.leftBtnText}
        </button>
        <span className="title" id={props.lengthID}>
          {props.value}
        </span>
        <button 
          onClick={()=>{props.onRightBtn(props.rightBtnID)}}
          id={props.rightBtnID}
          >
          {props.rightBtnText}
        </button>
      </div>
    );
  }
}


class TimerBox extends React.Component{
  render(){
    return(
      <div className="timerbox">
        <span className="title" id={this.props.labelID}>{this.props.label}</span>
        <BoxControls props={this.props} />
      </div>
    );
  }
}


class Pomodoro extends React.Component {
  constructor(props) {
    super(props);
    //this.audioRef = React.createRef();
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      buttonState: "play",
      clockTime: "25:00",
      clockCount: 1500,
      clockID: null,
      clockState: "Session",
      isRunning: false,
      isAlarming: false,
    };
    this.handleLeftBtn = this.handleLeftBtn.bind(this);
    this.handleRightBtn = this.handleRightBtn.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.formatClockTime = this.formatClockTime.bind(this);
    this.clockInit = this.clockInit.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  handleLeftBtn(props){
    if (props ==="break-decrement" && !this.state.isRunning){
      if (this.state.breakLength > 1){
        this.setState({
          breakLength: this.state.breakLength - 1,
        });
      }
    } else if (props === "session-decrement" && !this.state.isRunning){
      if (this.state.sessionLength > 1){
        this.clockInit(-1)
      }
    }
  }
  
  handleRightBtn(props){
    if (props ==="break-increment" && !this.state.isRunning){
      if (this.state.breakLength < 60){
        this.setState({
          breakLength: this.state.breakLength + 1,
        });
      }
    } else if (props === "session-increment" && !this.state.isRunning){
      if (this.state.sessionLength < 60){
        this.clockInit(1)
      }
    }
  }
  
  handlePlayPause(props){
    if (this.state.buttonState == "play") {    //user wants to "play"
      this.setState({
        buttonState: "pause",
        isRunning: true,
        clockID: accurateInterval(() => {this.countDown()}, 1000)
      });
    } else {                                  //user wants to "pause"
      this.setState({
        buttonState: "play",
        isRunning: false,
      });
      this.state.clockID.cancel();
    }
  }
  
  handleReset(props){
    if (this.state.isRunning) {
      this.state.clockID.cancel();
      this.setState({
        isRunning: false,
      });
    }
    
    //silence alarm and rewind
    this.audioRef.pause();
    this.audioRef.currentTime = 0;

    this.setState({
      breakLength: 5,
      sessionLength: 25,
      buttonState: "play",
      clockTime: "25:00",
      clockCount: 1500,
      clockID: null,
      clockState: "Session",
      isRunning: false,
      isAlarming: false,
    });
  }
  
  countDown() {
    let currentState = this.state.clockState;
    let newClockState = this.state.clockState;
    let oldClockCount = this.state.clockCount;
    
    if (this.state.clockCount > 0){                   //clock is > 0
      let newClockCount = oldClockCount - 1;             //reduce count by 1
      let newClockTime = this.formatClockTime(newClockCount);
      this.setState({
        clockTime: newClockTime,
        clockCount: newClockCount,
      });
      
    } else {                                          //clock time reached 0, sound alarm
      let switchedClockCount = 0;
      
      //sound the alarm
      this.audioRef.play();
      //end the audioRef
      //setTimeout(() => this.audio.pause(), 1100);
      
      
      if (currentState === "Session") {                   //switch to break
        newClockState = "Break";
        switchedClockCount = this.state.breakLength * 60;
      } else if (currentState == "Break") {               //switch to session
        newClockState = "Session";
        switchedClockCount = this.state.sessionLength * 60;
      }
      let newClockTime = this.formatClockTime(switchedClockCount);
      this.setState({
        clockTime: newClockTime,
        clockCount: switchedClockCount,
        clockState: newClockState
      });
    }
  }
  
  clockInit(change){
    let newSessionLength = this.state.sessionLength + change;
    let newClockCount = newSessionLength * 60;
    let newClockTime = this.formatClockTime(newClockCount);
    this.setState({
      sessionLength: newSessionLength,
      clockCount: newClockCount,
      clockTime: newClockTime,
    });
  }
  
  formatClockTime(clockCount) {
    let minutes = Math.floor(clockCount / 60);
    let seconds = clockCount % 60;
    if (clockCount == 0) {
      return "00:00";
    } else {
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return minutes + ":" + seconds;
    }
  }
  
  
  render() {
    return (
      <div className="wholeclock">
        <TimerBox 
          label="Break Length"
          labelID="break-label"
          leftBtnText="down"
          leftBtnID="break-decrement"
          onLeftBtn={this.handleLeftBtn}
          lengthID="break-length"
          value={this.state.breakLength}
          rightBtnText="up"
          rightBtnID="break-increment"
          onRightBtn={this.handleRightBtn}
        />
        <TimerBox 
          label={this.state.clockState}
          labelID="timer-label"
          leftBtnText="play"
          leftBtnID="start_stop"
          onLeftBtn={this.handlePlayPause}
          lengthID="time-left"
          value={this.state.clockTime}
          rightBtnText="reset"
          rightBtnID="reset"
          onRightBtn={this.handleReset}
        />
        <TimerBox 
          label="Session Length"
          labelID="session-label"
          leftBtnText="down"
          leftBtnID="session-decrement"
          onLeftBtn={this.handleLeftBtn}
          lengthID="session-length"
          value={this.state.sessionLength}
          rightBtnText="up"
          rightBtnID="session-increment"
          onRightBtn={this.handleRightBtn}
        />
        <audio
          preload="auto"
          ref={(input) => {this.audioRef = input}}
          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1872357/dancingSpearGuy.wav"
          id="beep"
        />
      </div>
    );
  }
}

//audio tag was a pain in the butt. Read this; 
//https://stackoverflow.com/questions/48748063/react-refs-audio-playback-unhandled-rejection-notsupportederror-on-ios
//and this;
//https://reactjs.org/docs/refs-and-the-dom.html

ReactDOM.render(<Pomodoro />, document.getElementById("MyApp"));


    </div>
  );
}

export default App;

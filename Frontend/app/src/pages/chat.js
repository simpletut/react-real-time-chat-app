import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import io from 'socket.io-client';
import ActiveUsers from './../components/activeUsers';
import Messages from './../components/messages';
import moment from 'moment';
import LoadingScreen from 'react-loading-screen';

var socket;
const initialState = {
    users: [],
    messages: [],
    newMsg: '',
    fetchingLocation: false
}

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...initialState
        }
    }

    componentWillUnmount(){
        const param = {
            room: this.props.match.params.room
        }
        socket.emit('leave', param);
        this.setState({...initialState});
    }

    componentDidMount() {
        const scopeThis = this;
        const params = {
            name: this.props.match.params.name,
            room: this.props.match.params.room
        }

        socket = io('http://localhost:8080')

        socket.emit('join', params, function (err) {
            if (err) {
                this.props.history.push('/');
            }
        });

        socket.on('updateUserList', function (users) {
            scopeThis.setState({
                users
            });
        });

        socket.on('newMessage', (message) => {
            var formattedTime = moment(message.createdDate).format('h:mm a');
            let newMsg = {
                text: message.text,
                from: message.from,
                room: message.room,
                createdDate: formattedTime
            }
            let results = scopeThis.state.messages;
            results.push(newMsg);
            scopeThis.setState({
                messages: results
            });

            var msgArr = scopeThis.state.messages.filter(message => message.room === this.props.match.params.room);
            if (msgArr.length > 3) {
                scopeThis.scrollToBottom();
            }
        });

        socket.on('createLocationMsg', (message) => {
            var formattedTime = moment(message.createdDate).format('h:mm a');
            let newMsg = {
                url: message.url,
                from: message.from,
                room: message.room,
                createdDate: formattedTime
            }
            let results = scopeThis.state.messages;
            results.push(newMsg);
            scopeThis.setState({
                messages: results,
                fetchingLocation: false
            });
        });

        socket.on('disconnect', function () {
            console.log('Connection lost from server.');
        });

    }

    scrollToBottom() {
        // selectors
        var listHeight = document.querySelector('.messages #list ul');
        var messagesList = document.querySelector('.messages #list');
        var newMessage = document.querySelector('.messages #list ul li:last-child');
        // heights
        var messagesWrapperHeight = listHeight.clientHeight;
        var clientHeight = messagesList.clientHeight;
        var scrollTop = messagesList.scrollTop;
        var scrollHeight = messagesList.scrollHeight;
        var newMessageHeight = newMessage.offsetHeight;
        var lastMessageHeight = newMessage.previousSibling.offsetHeight;

        if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            document.querySelector('#list').scrollTo(0, messagesWrapperHeight)
        }

    }

    clearForm() {
        this.setState({
            newMsg: ''
        });
    }

    inputUpdate(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({
            [name]: value
        });
    }

    newMessage(e) {
        e.preventDefault()
        var obj = {
            'text': this.state.newMsg
        };
        socket.emit('createMessage', obj, function (data) { });
        this.clearForm();
    }

    sendLocation() {
        this.setState({
            fetchingLocation: true
        });
        if (!navigator.geolocation) {
            return alert('GeoLocation not supported by your browser');
        }
        navigator.geolocation.getCurrentPosition((pos) => {
            socket.emit('createLocationMsg', {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            });
        }, () => {
            alert('Unable to fetch location');
        });
    }

    render() {

        const { newMsg } = this.state;

        return (
            <div className="chatPage">

                <LoadingScreen
                    loading={this.state.fetchingLocation}
                    bgColor='#F5F7F4'
                    spinnerColor='#3597DE'
                    textColor='#010000'
                    text='Fetching your current location'
                >
                    <div className="hide"></div>
                </LoadingScreen>

                <ActiveUsers users={this.state.users} />

                <div className="messages_wrap">

                    <h1>
                        <Link to="/">
                            <i className="fas fa-chevron-circle-left"></i>
                        </Link>
                        {this.props.match.params.room}
                    </h1>

                    <Messages messages={this.state.messages} room={this.props.match.params.room} />

                    <div className="newMsgForm">
                        <div className="wrap">
                            <form onSubmit={(e) => this.newMessage(e)}>

                                <div className="form_wrap">
                                    <div className="form_row">
                                        <div className="form_item">
                                            <div className="form_input">
                                                <input name="newMsg" placeholder="Type your message..." autoComplete="off" value={newMsg} onChange={this.inputUpdate.bind(this)} />
                                                <span className="bottom_border"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btnWrap">
                                    <button type="submit" className="btn">
                                        <i className="fab fa-telegram-plane"></i>
                                    </button>
                                    <button id="send_location" className="btn" onClick={() => this.sendLocation()}>
                                        <i className="far fa-compass"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Chat);
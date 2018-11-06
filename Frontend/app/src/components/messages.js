import React, { Component } from 'react';

class Messages extends Component {
    render() {
        return (
            <div className="messages">
                <div id="list">
                    <ul>
                        {this.props.messages.filter(message => message.room === this.props.room).map((message, index) => (
                            <li key={index}>

                                {message.url &&
                                    <div>
                                        <div className="msg">
                                            <h4>{message.from}</h4>
                                            <div className="body">
                                                <a href={message.url} rel="noopener noreferrer" target="_blank">My current location</a>
                                            </div>
                                        </div>
                                        <span className="createdDate">{message.createdDate}</span>
                                    </div>
                                }

                                {!message.url &&
                                    <div>
                                        <div className="msg">
                                            <h4>{message.from}</h4>
                                            <div className="body">
                                                <p>{message.text}</p>
                                            </div>
                                        </div>
                                        <span className="createdDate">{message.createdDate}</span>
                                    </div>
                                }

                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

export default Messages;
import React, {Component} from 'react';
import screen from '../../Assets/img/screen.png'


class About extends Component {
    render() {
        return (
            <section ref="about" className="content-section text-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="white_me">About NEST:R</h2>
                            <p className="about-text-main">NEST:R is a geolocation game where you compete over the control of Points of Interest on the map.</p>
                            <p className="about-text">The game idea is simple, all you have to do is to capture as many nests as possible.<br />
                            Are you ready to claim what's yours and expand your territory?
                            Sign up now and play for FREE!</p>
                            <img src={screen}></img>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default About;

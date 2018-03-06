import React, {Component} from 'react';

class About extends Component {
    render() {
        return (
            <section ref="about" className="content-section text-center">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 mx-auto">
                            <h2 className="white_me">About NEST:R</h2>
                            <p>NEST:R is a geolocation game where you compete over the control of Points of Interest on the map.</p>
                        </div>
                    </div>
                </div>
            </section>
        )

    }

}

export default About;

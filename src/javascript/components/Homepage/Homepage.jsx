import React, { PureComponent } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

class Homepage extends PureComponent {
	render() {
		let lang = localStorage.getItem('language');
        if (!lang) { lang = 'ro'; }
		return (
			<div>
				{
					lang === 'ro' ? 
						<div>
							<img className="imageStyle" src="images/banner_principal.jpg"/>
						</div>
					:
						null
				}
					{/* <Carousel showThumbs={false} infiniteLoop={true} showIndicators={false} autoPlay={true}>
						<div>
							<img src="images/1.jpg"/>
						</div>
						<div>
							<img src="images/2.jpg" />
						</div>
						<div>
							<img src="images/3.jpg" />
						</div>
						<div>
							<img src="images/4.jpg" />
						</div>
					</Carousel> */}
			</div>
		);
	}
}

export default Homepage;
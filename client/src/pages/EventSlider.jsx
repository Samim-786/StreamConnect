import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import slide1 from '../assets/calendar.png';
import slide2 from '../assets/schedule.png';

export default function FeatureSlider() {
  return (
    <section className="py-16 bg-white px-4 shadow-2xl">
     <h3 className="text-2xl font-semibold text-green-700 mb-2">Event Scheduling</h3>

      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={true}
        interval={6000}
        swipeable
        emulateTouch
      >
        <div className="text-center">
          <img src={slide1} alt="Calendar" className="mx-auto rounded shadow max-h-[500px] object-contain" />
          <p className="legend text-sm text-gray-700 mt-4">
            Choose a date from Calendar and make your Events easily
          </p>
        </div>

        <div className="text-center">
          <img src={slide2} alt="Schedule Event" className="mx-auto rounded shadow max-h-[500px] object-contain" />
          <p className="legend text-sm text-gray-700 mt-4">
            Select title,description and participants for event reminder
          </p>
        </div>
      </Carousel>
    </section>
  );
}

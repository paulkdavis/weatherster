import {useState} from 'react';

interface WindWidgetProps {
    wind: wind
  }
  
interface wind{
    deg: number
    speed: number
}
  
  function WindWidget({ wind }: WindWidgetProps) {
   
    //Vars
    const windInKMH = wind?.speed*3.6;

    //Constants
    const KM_TO_MILES_RATIO = 0.621371;

    //States
    const [isMetric, setIsMetric] = useState(true);

    return (
      <div id='wind-widget-container'>
          <span id='wind-text'>
            {isMetric ? Math.round(windInKMH) : Math.round(windInKMH*KM_TO_MILES_RATIO) }
            <span style={{cursor: 'pointer'}} onClick={() => {isMetric ? setIsMetric(false) : setIsMetric(true)}}>{isMetric ? 'km/h' : 'mph'}</span>
          </span>
      </div>
    );
  }
  
  export default WindWidget;
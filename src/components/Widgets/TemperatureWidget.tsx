import {useState} from 'react';
interface TemperatureWidgetProps {
  temperature: number;
}

function TemperatureWidget({ temperature }: TemperatureWidgetProps) {
 
  //Constants
  const METRIC_TO_FAHRENHEIT_RATIO = (9/5);
  const FAHRENHEIT_OFFSET = 32;

  //States
  const [isMetric, setIsMetric] = useState(true);

  return (
    <div id='temperature-widget-container'>
        <span id='temperature-text'>
          {isMetric ? temperature : Math.round(temperature*METRIC_TO_FAHRENHEIT_RATIO)+FAHRENHEIT_OFFSET}
          <span style={{cursor: 'pointer'}} onClick={() => {isMetric ? setIsMetric(false) : setIsMetric(true)}}>{isMetric ? '°C' : '°F'}</span>
        </span>
    </div>
  );
}

export default TemperatureWidget;
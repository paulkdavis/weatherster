interface TemperatureWidgetProps {
  temperature: number | undefined;
}


function TemperatureWidget({ temperature }: TemperatureWidgetProps) {
 
  return (
    <div id='temperature-widget-container'>
        <span id='temperature-text'>
        {temperature}°C
        </span>
    </div>
  );
}

export default TemperatureWidget;
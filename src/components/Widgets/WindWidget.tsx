interface WindWidgetProps {
    wind: wind | undefined
  }
  
interface wind{
    deg: number
    speed: number
}
  
  function WindWidget({ wind }: WindWidgetProps) {
   
    return (
      <div id='wind-widget-container'>
          <span id='wind-text'>
          {Math.round(wind?.speed == undefined ? 0 : wind?.speed*3.6)}km/h
          </span>
      </div>
    );
  }
  
  export default WindWidget;
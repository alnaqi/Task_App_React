import "./Container.css"

function Container(props) {
  return (
    <div className='App-container'>
      {props.children}
    </div>
  )
}

export default Container
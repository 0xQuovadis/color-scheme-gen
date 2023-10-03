import React from "react"
import './App.css'
import OptionsArray from "./assets/Options.js"

/* improvements: 
  - create components for dropdown list/scheme/btn?
  - custom number of colors
  - change current color to one of the scheme's with a click/btn 
  - additional customization tools from the API
*/

function App() {

  const [selectedColor, setSelectedColor] = React.useState(`#${randomColor()}`)
  const [schemeColors, setSchemeColors] = React.useState([])
  const [currentMode, setCurrentMode] = React.useState("monochrome")
  const [showDropdown, setShowDropdown] = React.useState(false)

  React.useEffect(() => {
    fetchColors()
  }, [])

  function handleColorCopy(color) {
    navigator.clipboard.writeText(color)
      .then(() => 
      alert('Copied to Clipboard!'))
      .catch((error) => 
      console.error('Failed to copy: ', error))

    /* execCommand is deprecated */
    // const textarea = document.createElement('textarea')
    // textarea.value = color
    // document.body.appendChild(textarea)
    // textarea.select()
    // document.execCommand('copy')
    // document.body.removeChild(textarea)
    // alert('Copied to Clipboard!')
  }

  function handleModeChange(mode) {
    setCurrentMode(mode)
    setShowDropdown(false)
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown)
  }

  function randomColor() {
    return (Math.floor(Math.random() * 999998) + 1)
  }

  function handleColorChange(e) {
    setSelectedColor(e.target.value)
  }

  function fetchColors() {
    fetch(`https://www.thecolorapi.com/scheme?hex=${selectedColor.slice(1)}&mode=${currentMode}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.colors)
      setSchemeColors(data.colors)
      console.log(schemeColors)})
  }

  const modeElements = OptionsArray.map(mode =>
        <p 
          className={`mode-choice ${mode === currentMode ? 'selected-mode' : ''}`}
          key={mode} 
          onClick={() => handleModeChange(mode)}
        >
          {mode}
        </p>
      )

  const schemeElements = schemeColors.map(color =>
      <div className="color-container"
        key={color.hex.value}
        onClick={() => handleColorCopy(color.hex.value)}>
        <div 
          className="color-container_background" 
          style={{backgroundColor: color.hex.value}}>
        </div>
        <h4 className="color-container_text">{color.hex.value}</h4>
      </div>
      )

  return (
    <>
      {showDropdown &&
      <div className="hide-click" onClick={toggleDropdown}></div>
      }
      <div className="color-pick">
        <input 
          type="color" 
          id="color-picker"
          /* set initial color - only use if required to save */
          value={selectedColor}
          onChange={handleColorChange}
          />
        <div className="dropdown-container">
          <p className="dropdown-first" onClick={() => toggleDropdown()}>{currentMode}</p>
          {showDropdown &&
          <div className="dropdown-list">
            {modeElements}
          </div>}
        </div>
        <button className="fetch-btn" onClick={() => fetchColors()}>Get color scheme</button>
      </div>
      <div className="color-scheme-container">
        {schemeElements}
      </div>
    </>
  )
}

export default App

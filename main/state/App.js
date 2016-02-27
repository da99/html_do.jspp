

// === Examples:
// App()
// App(..args for underlying Computer)
function App() {
  if (!App._computer) {
    App._computer = new Computer();
  }

  if (!is_empty(arguments))
    App._computer.apply(null, arguments);

  return App;
}

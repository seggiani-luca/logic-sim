A LAMP (JavaScript + PHP on Apache Web Server) web application implementing a 
simple logic circuit simulator.
The app should:
- On startup, show an interface consisting of an **header**, the **component 
  list** and the **workspace**: 
    * **Header**: top of the page, displays basic buttons for logging in/out, 
      saving/loading projects if logged in.
    * **Component list**: left side of page, shows a list of default components
      (AND, OR, XOR, inputs/outputs, ecc...), and (nice to have) a list of user
      defined components if any are present;
    * **Workspace*: right side of page, shows the current project as a RTL or
      similar level abstraction, using the components defined on the 
      **component list**.
- Allow user to drag components from the **component list** to the 
  **workspace**, move them after placing them, connect inputs and outputs of
  components to inputs and outputs of other component;
- Perform realtime simulation of the circuit: inputs can be updated in 
  realtime, and changes propagate to other components in realtime.
- Allow user to log in/out of an account and save projects (on server).
  Projects consist of arranged circuits.

JavaScript handles *interface* and *simulation*, PHP handles *saving*.

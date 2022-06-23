# popupCaller

### A sample App to demostrate popup dialpad, with crosswindow communication between parent and popup.

---

- Findings : https://docs.google.com/document/d/1VljNmN541O69BKYMEtyec4xHpv3qS2XRKzTPuDcTGT4/edit#
- Demo: https://mrc-sprinklr.github.io/popupCaller

#### Steps
- Set server_Address, uri and password.
- Add number to call.
- Click Dial Button. 
- Now Cross Communication is also established .
- Socket Connection happens in background.
- Clicking on green call button on popup window activates/imittes the Calling phase, and its color turns red.
- Reclicking the red turned call button willl close the call phase and as well close the popup.

---

Communication between parent and popup is established based on fact that they can access each other's function.

- Both have sendMessage() and recieveMessage() funtion.

- Inside parents's sendMessage function, recieveMessage() of popup is called with params as message to be exchanged.
  Same goes for other ways.

- Inside parents's script, parent is called by _window_ and instead of directly opening, popup is stored in a variable (in this case, _dialer_win_)called by that variable.
  Inside popup's script, parent is called by _window.opener_ and popup is called by _window_.

![alt text](https://raw.githubusercontent.com/mrc-sprinklr/popupCaller/main/readme_images/communication.jpeg)

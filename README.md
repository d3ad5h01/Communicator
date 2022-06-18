# popupCaller
### A sample App to demostrate popup dialpad, with crosswindow communication between parent and popup.

---

- Findings : https://docs.google.com/document/d/1VljNmN541O69BKYMEtyec4xHpv3qS2XRKzTPuDcTGT4/edit#
- Demo: https://mrc-sprinklr.github.io/popupCaller

---
Communication between parent and popup is established based on fact that they can access each other's function.

- Both have sendMessage() and recieveMessage() funtion.

- Inside Parents's sendMessage function, recieveMessege() of popup is called with params as messege to be exchanged.
Same goes for other ways.

![alt text](https://raw.githubusercontent.com/mrc-sprinklr/popupCaller/main/readme_images/communication.jpeg)


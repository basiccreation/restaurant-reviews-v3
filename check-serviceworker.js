      if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then(function() {
              // Registration was successful. Now, check to see whether the service worker is controlling the page.
              if (navigator.serviceWorker.controller) {
                  // If .controller is set, then this page is being actively controlled by the service worker.
                  document.querySelector('#status').textContent =
                      'This funky font has been cached by the controlling service worker.';
              } else {
                  // If .controller isn't set, then prompt the user to reload the page so that the service worker can take
                  // control. Until that happens, the service worker's fetch handler won't be used.
                  document.querySelector('#status').textContent =
                      'Please reload this page to allow the service worker to handle network operations.';
              }
          }).catch(function(error) {
              // Something went wrong during registration. The service-worker.js file
              // might be unavailable or contain a syntax error.
              //document.querySelector('#status').textContent = error;
          });
      } else {
          // The current browser doesn't support service workers.
          var aElement = document.createElement('a');
          aElement.href = 'http://www.chromium.org/blink/serviceworker/service-worker-faq';
          aElement.textContent = 'Service workers are not supported in the current browser.';
          //document.querySelector('#status').appendChild(aElement);
      }
### JSON Structure
```
<div>
  <div>Hello</div>
</div>
<div className="location">Brainers</div>
```

### Functionality
```
/**
 * @name : scrollToElement
 * @param Element
 * @description : Smooth Scrolling to Specific Element.
 */
export const scrollToElement = (destination, e) => {
  const classList = e.target.parentElement.classList.contains("active");
  if (!classList) {
    const easings = {
      easeOutQuart(t) {
        return 1 - --t * t * t * t;
      },
    };
    const duration = 3000;
    const easing = "easeOutQuart";

    const start = window.pageYOffset;
    const startTime = "now" in window.performance ? performance.now() : new Date().getTime();
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.getElementsByTagName("body")[0].clientHeight;
    const destinationOffset = typeof destination === "number" ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(
      documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset
    );

    if ("requestAnimationFrame" in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      return;
    }

    const scroll = () => {
      const now = "now" in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, (now - startTime) / duration);
      const timeFunction = easings[easing](time);
      window.scroll(0, Math.ceil(timeFunction * (destinationOffsetToScroll - start) + start));
      if (Math.ceil(window.pageYOffset) === destinationOffsetToScroll) {
        return;
      }

      requestAnimationFrame(scroll);
    };

    scroll();
  }
};
```


### Output Structure
```
<h6
  onClick={(e) => {
    scrollToElement(document.getElementsByClassName("location")[0], e)
  }}
>
  Click to scroll element
</h6>
```
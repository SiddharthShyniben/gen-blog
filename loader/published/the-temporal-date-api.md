---
social_image: null
main_image: null
tags: javascript, news
published_at: 2021-07-06T03:25:29.400Z
---

# The Temporal Date API

Have you heard of [Temporal](https://github.com/tc39/proposal-temporal)? It's an ECMAScript proposal currently at stage 3. It **'brings a modern date/time API to the ECMAScript language'**:

> `Date` has been a long-standing pain point in `ECMAScript`. This proposes `Temporal`, a global `Object` that acts as a top-level namespace (like `Math`), that brings a modern date/time API to the `ECMAScript` language. For a detailed breakdown of motivations, see: [Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/)
>
> Temporal fixes these problems by:
> - Providing easy-to-use APIs for date and time computations
> - First-class support for all time zones, including DST-safe arithmetic
> - Dealing only with objects representing fixed dates and times
> - Parsing a strictly specified string format
> - Supporting non-Gregorian calendars

The whole documentation is [here](https://tc39.es/proposal-temporal/docs/). It seems like a very interesting proposal and this might make libraries like Moment irrelevant.
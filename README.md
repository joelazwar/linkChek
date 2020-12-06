# linkChek

CLI tool to check links from a html file or url

## Install

```sh
npm install -g link-chek
```

```sh
npx link-chek
```

## How to use

```sh
linkChek -l [Filename or Webpage (Absolute) URL]
```

![GIF PREVIEW](assets/filepreview.gif)

![GIF PREVIEW](assets/htmlpreview.gif)

### HTTP Responses

- [GOOD] HTTP Response Code 200 - Success
- [BAD] HTTP Response Code 400/404 - Bad Request/Not Found
- [UNKNOWN] HTTP Response Code 3XX/5XX/etc. - Other Response (Redirect, Server Error, etc.)

<br />

## Options

### To check if HTTP links work with HTTPS

```sh
linkChek -l [Filename or Webpage (Absolute) URL] -o
```

### To set a Timeout

```sh
linkChek -l [Filename or Webpage (Absolute) URL] -t 7000
```

### Output JSON Option

<br />

Outputs JSON array consisting of url, and response status values

```sh
linkChek -l [Filename or Webpage (Absolute) URL] -j
```

### All/Good/Bad Flags

- All - Outputs all results (Default)
- Good - Outputs only [GOOD] (200) Results
- Bad - Outputs only [BAD] (400/404) Results

```sh
linkChek -l [Filename or Webpage (Absolute) URL] --all/--good/--bad
```

### Version Number

```
linkChek -v
```

### Help Option

```
linkChek -h
```

## Tests

To run tests, use the npm script

```
npm test
```

or

```
npm test [component].test.js
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

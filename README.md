# linkChek

CLI tool to check links from a html file or url

### Install

```
npm install -g <https://github.com/joelazwar/linkChek>
```

### How to use

```
- linkChek -l [Filename or Webpage URL]
```

![GIF PREVIEW](assets/filepreview.gif)

![GIF PREVIEW](assets/htmlpreview.gif)

### HTTP Responses

* [GOOD] HTTP Response Code 200 - Success
* [BAD] HTTP Response Code 400/404 - Bad Request/Not Found
* [UNKNOWN] HTTP Response Code 3XX/5XX/etc. - Other Response (Redirect, Server Error, etc.)

### Version Number

```
linkChek -v
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
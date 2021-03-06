import { Cookie } from "./models";
const fs = require('fs');

export default class HTML {
  static generateTable = (cookies: Array<Cookie>): string => {
    let html: string = '<table style="table-layout: fixed; width: 1280px">';
    html += '<tr>';
    for (var j in cookies[0]) {
      html += '<th>' + j + '</th>';
    }
    html += '</tr>';
    for (let i = 0; i < cookies.length; i++) {
      html += '<tr>';
      for (let j in cookies[i]) {
        html += '<td style="word-wrap: break-word;">' + cookies[i][j] + '</td>';
      }
      html += '</tr>';
    }
    html += '</table>';
    return html
  }

  static generateMarkUp = (cookies: Array<Cookie>): string => {
    return `
    <!DOCTYPE html>
        <html>
            <head>
            <style>table {border-collapse: collapse;}table, th, td{border:2px solid silver}th, td{padding:5px}</style>
            </head>
          <body>
          
            <h1>Cookie report</h1>
            <h2>Total Count: ${cookies.length}</h2>
            <h2>Execution date: ${new Date()}</h2>
            ${HTML.generateTable(cookies)}
          </body>
        </html>`
  }

  static createFile = (cookies: Array<Cookie>): void => {
    var fileName = './report.html';
    var stream = fs.createWriteStream(fileName);

    stream.once('open', function () {
      var html = HTML.generateMarkUp(cookies);
      stream.end(html);
    });
  }

}
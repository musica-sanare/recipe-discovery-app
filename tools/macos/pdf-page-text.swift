// Prints the text layer of selected PDF pages (macOS PDFKit), one block per page:
//   swift tools/macos/pdf-page-text.swift <file.pdf> <page> [<page> ...]
// Used only to verify manual transcriptions (docs/DATA_SOURCES.md "Cooking tables").
import Foundation
import PDFKit

let arguments = CommandLine.arguments
guard arguments.count >= 3, let document = PDFDocument(url: URL(fileURLWithPath: arguments[1])) else {
  FileHandle.standardError.write("usage: pdf-page-text.swift <file.pdf> <page>...\n".data(using: .utf8)!)
  exit(1)
}
for argument in arguments[2...] {
  guard let number = Int(argument), let page = document.page(at: number - 1) else {
    FileHandle.standardError.write("invalid page: \(argument)\n".data(using: .utf8)!)
    exit(1)
  }
  print("=====PAGE \(number)=====")
  print(page.string ?? "")
}

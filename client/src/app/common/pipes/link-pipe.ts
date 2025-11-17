import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'link',
  standalone: true,
})
export class LinkPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string): SafeHtml {
    if (!text) return text;

    let replaced = text;

    const urlRegex =
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)/g;

    replaced = replaced.replace(urlRegex, (url) => {
      let finalUrl = url;
      if (!finalUrl.startsWith('http')) finalUrl = 'http://' + finalUrl;

      return `<a class="link" href="${finalUrl}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;

    replaced = replaced.replace(mentionRegex, (mention, user) => {
      return `<a class="link">@${user}</a>`;
    });

    const hashtagRegex = /#([\p{L}0-9_]+)/gu;

    replaced = replaced.replace(hashtagRegex, (tag, word) => {
      return `<a class="link">#${word}</a>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(replaced);
  }
}

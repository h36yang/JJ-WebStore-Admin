import { TrimFileExtPipe } from './trim-file-ext.pipe';

describe('TrimFileExtPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimFileExtPipe();
    expect(pipe).toBeTruthy();
  });
});

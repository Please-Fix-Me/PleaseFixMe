import generatePassword from '../../app/utils/generatePassword'
import { generate } from 'random-words';

jest.mock('random-words', () => ({
  generate: jest.fn(),
}));

it('Should return a string', () => {
  generate.mockReturnValue(['TestWordPass']);
  const password = generatePassword();
  expect(typeof password).toBe('string');
});

it('Should pick first word if array is returned', () => {
  generate.mockReturnValue(['Test', 'Word']);
  const password = generatePassword();
  expect(password).toBe('Test');
});

it('Should handle the case when generate returns a string', () => {
  generate.mockReturnValue('Testword');
  const password = generatePassword();
  expect(password).toBe('Testword');
});

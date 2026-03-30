import { logEvent } from '../../services/logService';

describe('logService – logEvent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('naplóz projekt-azonosítóval és üzenettel', async () => {
    await logEvent('proj123', 'Task completed: Fix login bug');

    expect(console.log).toHaveBeenCalledWith(
      '[PROJECT proj123] Task completed: Fix login bug'
    );
  });

  it('naplóz felhasználói azonosítóval együtt, ha meg van adva', async () => {
    await logEvent('proj123', 'Task completed: Fix login bug', 'user456');

    expect(console.log).toHaveBeenCalledWith(
      '[PROJECT proj123] Task completed: Fix login bug by user user456'
    );
  });

  it('nem dob hibát, ha userId hiányzik', async () => {
    await expect(logEvent('proj123', 'Valami esemény')).resolves.not.toThrow();
  });

  it('pontosan egyszer hív console.log-ot', async () => {
    await logEvent('proj999', 'Egyszeri esemény');

    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('eltérő projekt ID-vel eltérő log üzenetet generál', async () => {
    await logEvent('projAAA', 'Esemény A');
    await logEvent('projBBB', 'Esemény B');

    expect(console.log).toHaveBeenNthCalledWith(1, '[PROJECT projAAA] Esemény A');
    expect(console.log).toHaveBeenNthCalledWith(2, '[PROJECT projBBB] Esemény B');
  });
});

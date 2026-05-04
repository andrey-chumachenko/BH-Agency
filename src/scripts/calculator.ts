const calculator = document.querySelector<HTMLFormElement>('[data-calculator]');
const legacyCalculator = document.querySelector<HTMLFormElement>('[data-legacy-calculator]');

const formatUsd = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

if (calculator) {
  const youtubeChoices = Array.from(
    calculator.querySelectorAll<HTMLButtonElement>('[data-calculator-youtube-choice]'),
  );
  const totalTarget = calculator.querySelector<HTMLElement>('[data-calculator-total]');

  const setYoutubeChoice = (choice: HTMLButtonElement) => {
    const group = choice.dataset.youtubeGroup;

    youtubeChoices
      .filter((item) => item.dataset.youtubeGroup === group)
      .forEach((item) => {
        const isSelected = item === choice;
        item.classList.toggle('is-selected', isSelected);
        item.setAttribute('aria-pressed', String(isSelected));
      });
  };

  const getYoutubeTotal = () =>
    youtubeChoices.reduce((sum, choice) => {
      if (!choice.classList.contains('is-selected')) return sum;
      return sum + Number(choice.dataset.value || 0);
    }, 0);

  const getAiTotal = () => {
    let total = 0;

    calculator.querySelectorAll<HTMLElement>('[data-calculator-ai-row]').forEach((row) => {
      const price = Number(row.dataset.price || 0);
      const input = row.querySelector<HTMLInputElement>('[data-calculator-ai-input]');
      const rowTotalTarget = row.querySelector<HTMLElement>('[data-calculator-ai-total]');
      const quantity = Math.max(0, Number(input?.value || 0));
      const rowTotal = price * quantity;

      if (input && String(quantity) !== input.value) input.value = String(quantity);
      if (rowTotalTarget) rowTotalTarget.textContent = formatUsd(rowTotal);

      total += rowTotal;
    });

    return total;
  };

  const calculate = () => {
    const total = getYoutubeTotal() + getAiTotal();
    if (totalTarget) totalTarget.textContent = formatUsd(total);
  };

  calculator.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const choice = target.closest<HTMLButtonElement>('[data-calculator-youtube-choice]');
    if (!choice) return;

    setYoutubeChoice(choice);
    calculate();
  });

  calculator.addEventListener('input', calculate);

  calculate();
}

const legacyPackages = {
  youtube: [
    { id: 'start', label: 'СТАРТ', price: 650 },
    { id: 'growth', label: 'РІСТ', price: 1200 },
    { id: 'system', label: 'СИСТЕМА', price: 2000 },
  ],
  ai: [
    { id: 'basic', label: 'БАЗОВИЙ', price: 350 },
    { id: 'optimal', label: 'ОПТИМАЛЬНИЙ', price: 700 },
    { id: 'expert', label: 'ЕКСПЕРТНИЙ', price: 1050 },
  ],
};

const fallbackRate = {
  rate: 41.5,
  date: '03.05.2026',
};

const formatUah = (value: number) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value);

const getRate = async () => {
  const cached = sessionStorage.getItem('usd-rate');
  if (cached) return JSON.parse(cached) as typeof fallbackRate;

  try {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json');
    const [data] = await response.json();
    const rate = { rate: Number(data.rate), date: String(data.exchangedate) };
    sessionStorage.setItem('usd-rate', JSON.stringify(rate));
    return rate;
  } catch {
    return fallbackRate;
  }
};

if (legacyCalculator) {
  const serviceSelect = legacyCalculator.querySelector<HTMLSelectElement>('[data-legacy-calculator-service]');
  const packageTarget = legacyCalculator.querySelector<HTMLElement>('[data-legacy-calculator-packages]');
  const usdTarget = legacyCalculator.querySelector<HTMLElement>('[data-legacy-calculator-usd]');
  const uahTarget = legacyCalculator.querySelector<HTMLElement>('[data-legacy-calculator-uah]');
  const rateTarget = legacyCalculator.querySelector<HTMLElement>('[data-legacy-calculator-rate]');
  let rate = fallbackRate;

  const renderPackages = () => {
    if (!serviceSelect || !packageTarget) return;
    const selected = serviceSelect.value as keyof typeof legacyPackages;

    packageTarget.innerHTML = legacyPackages[selected]
      .map(
        (item, index) => `
          <label class="legacy-calculator__package">
            <input type="radio" name="legacy-package" value="${item.price}" ${index === 1 ? 'checked' : ''} />
            <span>${item.label}</span>
            <small>${formatUsd(item.price)}</small>
          </label>
        `,
      )
      .join('');
  };

  const calculateLegacy = () => {
    const selectedPackage = legacyCalculator.querySelector<HTMLInputElement>('input[name="legacy-package"]:checked');
    const addons = Array.from(
      legacyCalculator.querySelectorAll<HTMLInputElement>('[data-legacy-calculator-addon]:checked'),
    );
    const base = Number(selectedPackage?.value || 0);
    const extra = addons.reduce((sum, addon) => sum + Number(addon.value), 0);
    const total = base + extra;

    if (usdTarget) usdTarget.textContent = formatUsd(total);
    if (uahTarget) uahTarget.textContent = `≈ ${formatUah(total * rate.rate)}`;
    if (rateTarget) rateTarget.textContent = `Курс НБУ: ${rate.rate.toFixed(2)} (${rate.date})`;
  };

  renderPackages();
  getRate().then((loadedRate) => {
    rate = loadedRate;
    calculateLegacy();
  });

  serviceSelect?.addEventListener('change', () => {
    renderPackages();
    calculateLegacy();
  });

  legacyCalculator.addEventListener('change', calculateLegacy);
}

export const getYMap = async () => {
    return new Promise((resolve, reject) => {
        if (window.ymaps) {
            resolve(window.ymaps);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=9d7871a4-0089-4cdf-8155-1d2c2a912e4a&lang=ru_RU`;
        script.async = true;

        script.onload = () => {
            if (window.ymaps) {
                resolve(window.ymaps);
            } else {
                reject(new Error('Yandex Maps not available'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load Yandex Maps'));

        document.head.appendChild(script);
    });
};

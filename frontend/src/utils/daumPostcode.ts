declare global {
    interface Window {
        daum?: {
            Postcode: new (options: {
                oncomplete: (data: { zonecode: string; address: string }) => void;
                width?: string | number;
                height?: string | number;
            }) => { embed: (container: HTMLElement) => void };
        };
    }
}

const SCRIPT_SRC = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

let loadPromise: Promise<void> | null = null;

export function loadDaumPostcodeScript(): Promise<void> {
    if (window.daum?.Postcode) return Promise.resolve();
    if (loadPromise) return loadPromise;

    loadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.onload = () => resolve();
        script.onerror = () => {
            loadPromise = null;
            reject(new Error('우편번호 서비스를 불러오지 못했습니다.'));
        };
        document.head.appendChild(script);
    });

    return loadPromise;
}

export function embedDaumPostcode(
    container: HTMLElement,
    onComplete: (result: { zonecode: string; address: string }) => void
) {
    if (!window.daum?.Postcode) {
        throw new Error('우편번호 서비스를 불러오지 못했습니다.');
    }
    new window.daum.Postcode({
        oncomplete: (data) => onComplete({ zonecode: data.zonecode, address: data.address }),
        width: '100%',
        height: '100%',
    }).embed(container);
}

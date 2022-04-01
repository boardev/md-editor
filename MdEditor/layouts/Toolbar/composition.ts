import { onMounted, inject } from 'vue';
import { prefix } from '../../config';
import { appendHandler } from '../../utils/dom';
import { ConfigOption } from '../../type';

export const useSreenfull = (props: any) => {
  const previewOnly = inject('previewOnly') as boolean;
  const extension = inject('extension') as ConfigOption;
  let screenfull = extension.editorExtensions?.screenfull?.instance;

  const fullScreenHandler = () => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    } else {
      console.error('browser does not support screenfull!');
    }
  };

  const screenfullLoad = () => {
    // 复制实例
    screenfull = window.screenfull;

    // 注册事件
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        props.updateSetting(!props.setting.fullscreen, 'fullscreen');
      });
    }
  };

  onMounted(() => {
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        props.updateSetting(!props.setting.fullscreen, 'fullscreen');
      });
    }

    if (!previewOnly && props.screenfull === null) {
      const screenScript = document.createElement('script');
      screenScript.src = props.screenfullJs;
      screenScript.addEventListener('load', screenfullLoad);
      screenScript.id = `${prefix}-screenfull`;

      appendHandler(screenScript);
    }
  });

  return { fullScreenHandler };
};
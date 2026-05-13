import { UnreachableError } from 'base/preconditions';
import { AlphaMaskEffect } from 'pages/editor/editing/video/bootstrap/video_editing_bootstrap_proto';
import {
  ElementAnimationId,
  PageAnimationId,
  RepeatingAnimationsType,
} from 'services/ripple/document/model/model';
import caption_highlight_poster from './caption/highlight.svg';
import caption_reveal_poster from './caption/reveal.svg';
import caption_snake_poster from './caption/snake.svg';
import element_baseline_poster from './element/baseline.svg';
import element_blur_poster from './element/blur.svg';
import element_breathe_poster from './element/breathe.svg';
import element_brush_poster from './element/brush.svg';
import element_brush_slide_poster from './element/brush_slide.svg';
import element_chroma_wave_poster from './element/chroma_wave.svg';
import element_digital_poster from './element/digital.svg';
import element_drift_poster from './element/drift.svg';
import element_fade_poster from './element/fade.svg';
import element_follow_path from './element/follow_path.png';
import element_geometric_poster from './element/geometric.svg';
import element_gradient_poster from './element/gradient.svg';
import element_ink_poster from './element/ink.svg';
import element_liquid_poster from './element/liquid.svg';
import element_neon_poster from './element/neon.svg';
import element_none_poster from './element/none.svg';
import element_old_tv_poster from './element/old_tv.svg';
import element_pan_poster from './element/pan.svg';
import element_pattern_poster from './element/pattern.svg';
import element_pop_poster from './element/pop.svg';
import element_rise_poster from './element/rise.svg';
import element_scrapbook_poster from './element/scrapbook.svg';
import element_shake_zoom_poster from './element/shake_zoom.svg';
import element_sketch_poster from './element/sketch.svg';
import element_spray_paint_poster from './element/spray_paint.svg';
import element_stomp_poster from './element/stomp.svg';
import element_succession_poster from './element/succession.svg';
import element_tectonic_poster from './element/tectonic.svg';
import element_tumble_poster from './element/tumble.svg';
import element_wipe_poster from './element/wipe.svg';
import page_baseline_poster from './page/baseline.svg';
import page_block_poster from './page/block.svg';
import page_breathe_poster from './page/breathe.svg';
import page_chill_poster from './page/chill.svg';
import page_corporate_poster from './page/corporate.svg';
import page_dark_bold_poster from './page/dark/page_bold.png';
import page_dark_digital_poster from './page/dark/page_digital.png';
import page_dark_disco_poster from './page/dark/page_disco.png';
import page_dark_elegant_poster from './page/dark/page_elegant.png';
import page_dark_energetic_poster from './page/dark/page_energetic.png';
import page_dark_grunge_poster from './page/dark/page_grunge.png';
import page_dark_handmade_poster from './page/dark/page_handmade.png';
import page_dark_minimal_poster from './page/dark/page_minimal.png';
import page_dark_playful_poster from './page/dark/page_playful.png';
import page_dark_professional_poster from './page/dark/page_professional.png';
import page_drift_poster from './page/drift.svg';
import page_fade_poster from './page/fade.svg';
import page_fun_poster from './page/fun.svg';
import page_light_bold_poster from './page/light/page_bold.png';
import page_light_digital_poster from './page/light/page_digital.png';
import page_light_disco_poster from './page/light/page_disco.png';
import page_light_elegant_poster from './page/light/page_elegant.png';
import page_light_energetic_poster from './page/light/page_energetic.png';
import page_light_grunge_poster from './page/light/page_grunge.png';
import page_light_handmade_poster from './page/light/page_handmade.png';
import page_light_minimal_poster from './page/light/page_minimal.png';
import page_light_playful_poster from './page/light/page_playful.png';
import page_light_professional_poster from './page/light/page_professional.png';
import page_neon_poster from './page/neon.svg';
import page_pan_poster from './page/pan.svg';
import page_party_poster from './page/party.svg';
import page_photo_flow from './page/photo_flow.svg';
import page_photo_rise from './page/photo_rise.svg';
import page_photo_zoom from './page/photo_zoom.svg';
import page_pop_poster from './page/pop.svg';
import page_rise_poster from './page/rise.svg';
import page_scrapbook_poster from './page/scrapbook.svg';
import page_simple_poster from './page/simple.svg';
import page_sleek_poster from './page/sleek.svg';
import page_stomp_poster from './page/stomp.svg';
import page_tectonic_poster from './page/tectonic.svg';
import page_tumble_poster from './page/tumble.svg';
import page_wipe_poster from './page/wipe.svg';
import photo_flow_poster from './photo/photo_flow.svg';
import photo_rise_poster from './photo/photo_rise.svg';
import photo_zoom_poster from './photo/photo_zoom.svg';
import repeating_flicker_poster from './repeating/flicker.svg';
import repeating_pulse_poster from './repeating/pulse.svg';
import repeating_rotate_poster from './repeating/rotate.svg';
import repeating_wiggle_poster from './repeating/wiggle.svg';
import text_ascend_poster from './text/ascend.svg';
import text_block_poster from './text/block.svg';
import text_bounce_poster from './text/bounce.svg';
import text_burst_poster from './text/burst.svg';
import text_clarify_poster from './text/clarify.svg';
import text_merge_poster from './text/merge.svg';
import text_roll_poster from './text/roll.svg';
import text_shift_poster from './text/shift.svg';
import text_skate_poster from './text/skate.svg';
import text_spread_poster from './text/spread.svg';
import text_typewriter_poster from './text/typewriter.svg';

type ThumbnailSrc = {
  light: string;
  dark: string;
};

// TODO(steve): remove fallback when all thumbnails are shifted to svgs
const themeFallback = (src: string) => ({ light: src, dark: src });

export function getPageThumbnail(pageAnimationId: PageAnimationId | undefined): ThumbnailSrc {
  switch (pageAnimationId) {
    case undefined:
    case PageAnimationId.SIMPLE_SLOW:
    case PageAnimationId.SIMPLE_MEDIUM:
    case PageAnimationId.SIMPLE_FAST:
      return themeFallback(element_none_poster);
    case PageAnimationId.BASELINE:
      return themeFallback(page_baseline_poster);
    case PageAnimationId.BLOCK:
      return themeFallback(page_block_poster);
    case PageAnimationId.BREATHE:
      return themeFallback(page_breathe_poster);
    case PageAnimationId.DRIFT:
      return themeFallback(page_drift_poster);
    case PageAnimationId.FADE:
      return themeFallback(page_fade_poster);
    case PageAnimationId.NEON:
      return themeFallback(page_neon_poster);
    case PageAnimationId.PAN:
      return themeFallback(page_pan_poster);
    case PageAnimationId.POP:
      return themeFallback(page_pop_poster);
    case PageAnimationId.RISE:
      return themeFallback(page_rise_poster);
    case PageAnimationId.SCRAPBOOK:
      return themeFallback(page_scrapbook_poster);
    case PageAnimationId.STOMP:
      return themeFallback(page_stomp_poster);
    case PageAnimationId.TECTONIC:
      return themeFallback(page_tectonic_poster);
    case PageAnimationId.TUMBLE:
      return themeFallback(page_tumble_poster);
    case PageAnimationId.WIPE:
      return themeFallback(page_wipe_poster);
    case PageAnimationId.PHOTO_ZOOM:
      return themeFallback(page_photo_zoom);
    case PageAnimationId.PHOTO_FLOW:
      return themeFallback(page_photo_flow);
    case PageAnimationId.PHOTO_RISE:
      return themeFallback(page_photo_rise);

    // Page Combinations
    case PageAnimationId.SIMPLE:
      return themeFallback(page_simple_poster);
    case PageAnimationId.SLEEK:
      return themeFallback(page_sleek_poster);
    case PageAnimationId.FUN:
      return themeFallback(page_fun_poster);
    case PageAnimationId.DISCO:
      return {
        light: page_light_disco_poster,
        dark: page_dark_disco_poster,
      };
    case PageAnimationId.PARTY:
      return themeFallback(page_party_poster);
    case PageAnimationId.CORPORATE:
      return themeFallback(page_corporate_poster);
    case PageAnimationId.CHILL:
      return themeFallback(page_chill_poster);

    // Magic Animations
    case PageAnimationId.BOLD:
      return {
        light: page_light_bold_poster,
        dark: page_dark_bold_poster,
      };
    case PageAnimationId.ELEGANT:
      return {
        light: page_light_elegant_poster,
        dark: page_dark_elegant_poster,
      };
    case PageAnimationId.ENERGETIC:
      return {
        light: page_light_energetic_poster,
        dark: page_dark_energetic_poster,
      };
    case PageAnimationId.PROFESSIONAL:
      return {
        light: page_light_professional_poster,
        dark: page_dark_professional_poster,
      };
    case PageAnimationId.PLAYFUL:
      return {
        light: page_light_playful_poster,
        dark: page_dark_playful_poster,
      };
    case PageAnimationId.HANDMADE:
      return {
        light: page_light_handmade_poster,
        dark: page_dark_handmade_poster,
      };
    case PageAnimationId.DIGITAL:
      return {
        light: page_light_digital_poster,
        dark: page_dark_digital_poster,
      };
    case PageAnimationId.GRUNGE:
      return {
        light: page_light_grunge_poster,
        dark: page_dark_grunge_poster,
      };
    case PageAnimationId.MINIMAL:
      return {
        light: page_light_minimal_poster,
        dark: page_dark_minimal_poster,
      };

    default:
      throw new UnreachableError(pageAnimationId);
  }
}

export function getAnimationMaskThumbnail(maskEffect: AlphaMaskEffect): string {
  switch (maskEffect) {
    case AlphaMaskEffect.GLITCH:
      return element_none_poster;
    case AlphaMaskEffect.INK_BLEED:
      return element_ink_poster;
    case AlphaMaskEffect.PAINT_BRUSH:
      return element_brush_poster;
    case AlphaMaskEffect.GEOMETRIC:
      return element_geometric_poster;
    case AlphaMaskEffect.DIGITAL:
      return element_digital_poster;
    case AlphaMaskEffect.LIQUID:
      return element_liquid_poster;
    case AlphaMaskEffect.PATTERN:
      return element_pattern_poster;
    case AlphaMaskEffect.SPRAY_PAINT:
      return element_spray_paint_poster;
    case AlphaMaskEffect.SKETCH:
      return element_sketch_poster;
    case AlphaMaskEffect.GRADIENT:
      return element_gradient_poster;
    default:
      throw new UnreachableError(maskEffect);
  }
}

export function getElementThumbnail(
  elementAnimationId:
    | Exclude<ElementAnimationId, ElementAnimationId.CUSTOM_ANIMATION_MASK>
    | undefined
    | 'static',
): string {
  switch (elementAnimationId) {
    // TODO(steve): add thumbnails for missing animations
    case ElementAnimationId.CAPTION_GROW:
    case ElementAnimationId.CAPTION_SINGALONG:
    case ElementAnimationId.PULSE:
    case ElementAnimationId.S_MOVEMENT:
    case ElementAnimationId.GLITCH:
    case ElementAnimationId.BOKEH_BLUR:
    case ElementAnimationId.OLD_FILM:
    case 'static':
    case undefined:
      return element_none_poster;
    case ElementAnimationId.BASELINE:
      return element_baseline_poster;
    case ElementAnimationId.BLUR:
      return element_blur_poster;
    case ElementAnimationId.BREATHE:
      return element_breathe_poster;
    case ElementAnimationId.DRIFT:
      return element_drift_poster;
    case ElementAnimationId.FADE:
      return element_fade_poster;
    case ElementAnimationId.NEON:
      return element_neon_poster;
    case ElementAnimationId.PAN:
      return element_pan_poster;
    case ElementAnimationId.POP:
      return element_pop_poster;
    case ElementAnimationId.RISE:
      return element_rise_poster;
    case ElementAnimationId.SCRAPBOOK:
      return element_scrapbook_poster;
    case ElementAnimationId.STOMP:
    case ElementAnimationId.SHAKE:
      return element_stomp_poster;
    case ElementAnimationId.SUCCESSION:
      return element_succession_poster;
    case ElementAnimationId.TECTONIC:
      return element_tectonic_poster;
    case ElementAnimationId.TUMBLE:
      return element_tumble_poster;
    case ElementAnimationId.WIPE:
      return element_wipe_poster;
    case ElementAnimationId.PHOTO_ZOOM:
      return photo_zoom_poster;
    case ElementAnimationId.PHOTO_FLOW:
      return photo_flow_poster;
    case ElementAnimationId.PHOTO_RISE:
      return photo_rise_poster;
    case ElementAnimationId.TEXT_BLOCK:
      return text_block_poster;
    case ElementAnimationId.TEXT_ASCEND:
      return text_ascend_poster;
    case ElementAnimationId.TEXT_BOUNCE:
      return text_bounce_poster;
    case ElementAnimationId.TEXT_BURST:
      return text_burst_poster;
    case ElementAnimationId.TEXT_CLARIFY:
      return text_clarify_poster;
    case ElementAnimationId.TEXT_MERGE:
      return text_merge_poster;
    case ElementAnimationId.TEXT_ROLL:
      return text_roll_poster;
    case ElementAnimationId.TEXT_SHIFT:
      return text_shift_poster;
    case ElementAnimationId.TEXT_SKATE:
      return text_skate_poster;
    case ElementAnimationId.TEXT_SPREAD:
      return text_spread_poster;
    case ElementAnimationId.TEXT_TYPEWRITER:
      return text_typewriter_poster;
    case ElementAnimationId.CUSTOM_FOLLOW_PATH:
      return element_follow_path;
    case ElementAnimationId.CAPTION_HIGHLIGHT:
      return caption_highlight_poster;
    case ElementAnimationId.CAPTION_REVEAL:
      return caption_reveal_poster;
    case ElementAnimationId.CAPTION_SNAKE:
      return caption_snake_poster;
    case ElementAnimationId.SHAKE_ZOOM:
      return element_shake_zoom_poster;
    case ElementAnimationId.BRUSH_SLIDE:
      return element_brush_slide_poster;
    case ElementAnimationId.CHROMA_WAVE:
      return element_chroma_wave_poster;
    case ElementAnimationId.OLD_TV:
      return element_old_tv_poster;
    default:
      throw new UnreachableError(elementAnimationId);
  }
}

export function getRepeatingThumbnail(repeatingAnimationsType: RepeatingAnimationsType): string {
  switch (repeatingAnimationsType) {
    case RepeatingAnimationsType.ROTATE:
      return repeating_rotate_poster;
    case RepeatingAnimationsType.FLICKER:
      return repeating_flicker_poster;
    case RepeatingAnimationsType.PULSE:
      return repeating_pulse_poster;
    case RepeatingAnimationsType.WIGGLE:
      return repeating_wiggle_poster;
    default:
      throw new UnreachableError(repeatingAnimationsType);
  }
}

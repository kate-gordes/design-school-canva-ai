import composeRefs from '@seznam/compose-react-refs';
import { Preconditions, UnreachableError } from 'base/preconditions';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { TextFadeIn } from 'ui/assistant/magic_assistant/search_bar/voice_input/text_fade_in/text_fade_in';
import { Box } from 'ui/base/box/box';
import { CircleButton } from 'ui/base/button/button';
import { Divider } from 'ui/base/divider/divider';
import { Form } from 'ui/base/form/base_form/base_form';
import { MultilineInput } from 'ui/base/form/multiline_input/multiline_input';
import { TextInput } from 'ui/base/form/text_input/text_input';
import { ArrowRightIcon } from 'ui/base/icons/arrow_right/icon';
import { MagicSearchColorIcon } from 'ui/base/icons/magic_search_color/icon';
import { SearchIcon } from 'ui/base/icons/search/icon';
import { XIcon } from 'ui/base/icons/x/icon';
import { useKeyCombinationHandler } from 'ui/base/key_combinations/key_combinations';
import { Bleed, Column, Columns, Spacer } from 'ui/base/layout/layout';
import { OutsidePointerDownHandler } from 'ui/base/outside_pointerdown_handler/outside_pointerdown_handler';
import { useResponsiveValue } from 'ui/base/responsive/use_responsive_value';
import type { ScrollableRef } from 'ui/base/scrollable/scrollable';
import { Scrollable } from 'ui/base/scrollable/scrollable';
import { featureFlag } from 'ui/flags/feature_flag';
import type {
  GetAdjustments,
  InputHandle,
  SetAdjustments,
  SuggestionsHandle,
} from '@/pages/home/Brand/example-code/api';
import type { WonderBoxAttachment } from '@/pages/home/Brand/example-code/attachments/api';
import type { TypingTelemetryHelper } from '@/pages/home/Brand/example-code/telemetry/typing_telemetry_helper';
import type { WonderBoxVoiceInputButtonProps } from '@/pages/home/Brand/example-code/voice_input/create';
import { WonderBoxVoiceInputMessages } from '@/pages/home/Brand/example-code/voice_input/wonder_box_voice_input.messages';
import { DocumentSearchToggleButton } from './document_search_toggle/document_search_toggle';
import styles from './wonder_box_input.css';
import { WonderBoxInputMessages } from './wonder_box_input.messages';
import { WonderBoxTabLoadingState } from './wonder_box_tabs';

export type SubmitType = 'default' | 'suggestion' | 'adjustment';
export type Layout = 'relaxed' | 'compact' | 'compact-inverted';

export type WonderBoxInputProps = {
  value: string;
  onChange: (value: string) => void;
  setInputValue: (value: string) => void;
  onFocus: () => void;
  isOpen: boolean;
  isOffline: boolean;
  onTextInputClick: () => void;
  isVoiceInputActive: boolean;
  onClose: () => void;
  /**
   * Callback to handle form submission.
   *
   * Called when:
   *   - The user clicks the submit button.
   *   - The user presses Enter in the input field.
   *   - The user selects a suggestion.
   */
  onSubmit: (args: {
    input: string;
    submitType: SubmitType;
    attachments: WonderBoxAttachment[];
    documentSearchActive: boolean;
    getAdjustments: GetAdjustments;
    setAdjustments: SetAdjustments;
  }) => void;
  attachments: WonderBoxAttachment[];
  addAttachment: (attachment: WonderBoxAttachment, onlyReplaceExisting?: boolean) => void;
  clearAttachments: () => void;
  getAdjustments: GetAdjustments;
  setAdjustments: SetAdjustments;
  WonderBoxVoiceInputButton: React.ComponentType<WonderBoxVoiceInputButtonProps> | undefined;
  WonderBoxDropzone: React.ComponentType<
    React.PropsWithChildren<{
      isEnabled: boolean;
      addAttachment: (attachment: WonderBoxAttachment, onlyReplaceExisting?: boolean) => void;
    }>
  >;
  typingTelemetryHelper: TypingTelemetryHelper;
  enableRevealAnimation: boolean;
  isToggling: boolean;
  setIsToggling: (isToggling: boolean) => void;
  inputDimensionsRef: React.MutableRefObject<{
    open: { width: number; height: number } | null;
    closed: { width: number; height: number } | null;
  }>;
  getSessionId: () => string;
  refHandle?: React.RefObject<InputHandle | null>;
  documentSearchActive: boolean;
  toggleDocumentSearch: () => void;
  /**
   * Render prop to provide adjustments UI below the input field.
   *
   * If not provided, the adjustments section will be missing.
   */
  renderAdjustments:
    | ((opts: {
        deferredInputValue: string;
        setInputState: (val: string) => void;
        layout: Layout;
        attachments: WonderBoxAttachment[];
        getAdjustments: GetAdjustments;
        setAdjustments: SetAdjustments;
        isOffline: boolean;
      }) => React.JSX.Element)
    | undefined;
  /**
   * Render prop to provide suggestions UI as the user types.
   *
   * If not provided, the suggestions UI will not be rendered.
   */
  renderSuggestions:
    | ((opts: {
        handleRef: React.RefObject<SuggestionsHandle | null>;
        query: string;
        deferredQuery: string;
        isOffline: boolean;
        getSessionId: () => string;
        onSelect: (value: string) => void;
      }) => { element: React.JSX.Element; isDeferred: boolean })
    | undefined;
  /**
   * Placeholder text for the input field.
   */
  placeholder: string | undefined;
  /**
   * Selects the HTML element type to use for the input field. Defaults to
   * 'text'.
   */
  inputElementType: 'text' | 'multiline' | undefined;
  /**
   * Sets the maximum length on the input field element.
   */
  maxLength: number | undefined;
  /**
   * Callback to be called when the clear button is clicked.
   */
  onClear: (() => void) | undefined;
  /**
   * If true, the submit button will not be rendered.
   */
  hideSubmitButton: boolean;
  /**
   * Controls the current submission state of the form.
   */
  formSubmitState:
    | { state: 'loading' }
    | { state: 'disabled'; reason?: string }
    | { state: 'enabled' };
  /**
   * Applied to the role attribute of the form element.
   */
  formRole: 'search' | 'form';
  /**
   * If provided, renders the attachment cards below the input field.
   */
  attachmentCards: React.JSX.Element | undefined;
  /**
   * If provided, renders the attachment uploader control below the input
   * field.
   */
  attachmentUploader: React.JSX.Element | undefined;
  /**
   * Disables firing events on the suggestions handler.
   */
  disableSuggestionsEvents: boolean;
  /**
   * Called to handle paste events on the input field, only when the Wonder
   * Box is open.
   */
  onPaste: ((e: React.ClipboardEvent) => Promise<void>) | undefined;
  /**
   * Controls the color palette of the Wonder Box.
   */
  palette: 'solid' | 'gradient';
  /**
   * Enables dropzone for adding attachments.
   */
  enableDropzone: boolean;
  /**
   * Enables rendering the control button for document search.
   */
  showDocumentSearchControl: boolean;
  /**
   * Controls the state of the voice input button.
   */
  voiceInputButtonState: 'enabled' | 'disabled' | 'hidden';
  /**
   * Controls the UI treatment of the wonder box.
   */
  layout?: Layout;
};

const transitionDuration = parseInt(styles.transitionDuration, 10);

const WonderBoxFormContext = React.createContext<
  | {
      tooltipLabel: string | undefined;
      state: 'loading' | 'disabled' | 'enabled';
      onSubmit: (() => void) | undefined;
    }
  | undefined
>(undefined);

const WonderBoxForm = observer(function WonderBoxForm({
  formState,
  isOffline,
  isVoiceInputActive,
  children,
  handleSubmit,
  role,
}: {
  formState: { state: 'loading' } | { state: 'disabled'; reason?: string } | { state: 'enabled' };
  isOffline: boolean;
  isVoiceInputActive: boolean;
  children: React.ReactNode;
  handleSubmit: () => void;
  role: 'search' | 'form';
}) {
  const disableSubmit = React.useMemo(() => {
    if (isOffline || isVoiceInputActive) {
      return true;
    }

    return formState.state !== 'enabled';
  }, [formState, isOffline, isVoiceInputActive]);

  const contextValue = React.useMemo(() => {
    return {
      tooltipLabel:
        formState.state === 'disabled' && formState.reason != null
          ? formState.reason
          : WonderBoxInputMessages.submit(),
      onSubmit: disableSubmit ? undefined : handleSubmit,
      state:
        formState.state === 'loading'
          ? ('loading' as const)
          : disableSubmit
            ? ('disabled' as const)
            : formState.state,
    };
  }, [formState, disableSubmit, handleSubmit]);

  return (
    <Form
      action="search"
      onSubmit={disableSubmit ? () => {} : handleSubmit}
      disabled={disableSubmit}
      role={role}
      children={
        <WonderBoxFormContext.Provider value={contextValue}>
          {children}
        </WonderBoxFormContext.Provider>
      }
    />
  );
});

function WonderBoxSubmitButton() {
  const ctx = Preconditions.checkExists(
    React.useContext(WonderBoxFormContext),
    'SubmitButton must be used within a WonderBoxForm',
  );
  const tooltipLabel = ctx.tooltipLabel || WonderBoxInputMessages.submit();
  const disabled = React.useMemo(() => {
    return ctx.state !== 'enabled';
  }, [ctx]);

  return (
    <Column width="content">
      <CircleButton
        tooltipLabel={tooltipLabel}
        type="submit"
        size="small"
        icon={ArrowRightIcon}
        variant="primary"
        disabled={disabled}
        loading={ctx.state === 'loading'}
      />
    </Column>
  );
}

export const WonderBoxInput: React.ComponentType<WonderBoxInputProps> = observer(
  function WonderBoxInput({
    onFocus,
    value,
    onChange,
    setInputValue,
    isOpen,
    isOffline,
    isVoiceInputActive,
    onClose,
    onSubmit,
    onTextInputClick,
    attachments,
    addAttachment,
    clearAttachments,
    getAdjustments,
    setAdjustments,
    WonderBoxVoiceInputButton,
    WonderBoxDropzone,
    typingTelemetryHelper,
    enableRevealAnimation,
    isToggling,
    setIsToggling,
    inputDimensionsRef,
    getSessionId,
    refHandle,
    documentSearchActive,
    toggleDocumentSearch,
    renderAdjustments,
    renderSuggestions,
    placeholder,
    maxLength,
    inputElementType,
    onClear,
    formSubmitState,
    formRole,
    hideSubmitButton,
    attachmentCards,
    attachmentUploader,
    disableSuggestionsEvents,
    onPaste,
    palette,
    enableDropzone,
    showDocumentSearchControl,
    voiceInputButtonState,
    layout = 'relaxed',
  }) {
    React.useImperativeHandle<InputHandle, InputHandle>(refHandle, () => {
      return {
        focus: (opts?: { smoothScroll?: boolean }) => {
          if (opts?.smoothScroll) {
            inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            inputRef.current?.focus({ preventScroll: true });
          } else {
            inputRef.current?.focus();
          }
        },
        getLength: () => inputRef.current?.value.length,
        setSelectionRange: (start: number | null, end: number | null) => {
          inputRef.current?.setSelectionRange(start, end);
        },
        get selectionStart() {
          return inputRef.current?.selectionStart ?? undefined;
        },
        get selectionEnd() {
          return inputRef.current?.selectionEnd ?? undefined;
        },
      };
    }, []);

    const [suggestionsFlyoutIsOpen, setSuggestionsFlyoutIsOpen] = React.useState(false);

    const inputRef = React.useRef<WonderBoxInputRef>(null);

    const suggestionsHandleRef = React.useRef<SuggestionsHandle>(null);

    const onArrowUp = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isOpen) {
          return;
        }

        if (disableSuggestionsEvents) {
          return;
        }

        // Arrows would scroll the container by default, so these handlers are default prevented
        e.preventDefault();
        // Disable navigation while input is composing, fix for IME keyboards suggestions on Desktop.
        if (e.isComposing) {
          return;
        }
        suggestionsHandleRef.current?.prev();
      },
      [disableSuggestionsEvents, isOpen],
    );

    const onArrowDown = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isOpen) {
          return;
        }

        if (disableSuggestionsEvents) {
          return;
        }

        e.preventDefault();
        // Disable navigation while input is composing, fix for IME keyboards suggestions on Desktop.
        if (e.isComposing) {
          return;
        }
        suggestionsHandleRef.current?.next();
      },
      [disableSuggestionsEvents, isOpen],
    );

    const onEnter = React.useCallback(
      (e: KeyboardEvent) => {
        if (!isOpen) {
          return;
        }

        if (disableSuggestionsEvents) {
          return;
        }

        // e.isComposing is not used here due to a won't fix bug on chrome + Gboard
        // https://bugs.chromium.org/p/chromium/issues/detail?id=809107
        // Although not guaranteed, keyCode is expected to be 299 when an IME is processing keys
        // https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
        // // Disable selection earlier than expected, fix for IME keyboards suggestions on Desktop.
        // // Expected behaviour:
        // // - Enter (Chinese) is expected to stop composition.
        // // - Enter (Japanese) is expected to select currently highlighted keyboard prompt suggestion.
        // if (e.keyCode === 229) {
        //   return;
        // }
        const preventDefault = suggestionsHandleRef.current?.select();
        if (preventDefault) {
          e.preventDefault();
        }
      },
      [disableSuggestionsEvents, isOpen],
    );

    const { ref: keyHandlerRef } = useKeyCombinationHandler(
      [
        ['Escape', onClose],
        ['ArrowUp', onArrowUp],
        ['ArrowDown', onArrowDown],
        ['Enter', onEnter],
      ],
      {
        handleInputs: true,
      },
    );

    const setRef = React.useCallback((ref: WonderBoxInputRef) => {
      inputRef.current = ref;
    }, []);

    const handleSuggestionSelect = React.useCallback(
      (value: string) => {
        setInputValue(value);
        onSubmit({
          input: value,
          submitType: 'suggestion',
          documentSearchActive,
          attachments,
          getAdjustments,
          setAdjustments,
        });
        setSuggestionsFlyoutIsOpen(false);
      },
      [setInputValue, onSubmit, documentSearchActive, attachments, getAdjustments, setAdjustments],
    );

    const handleSubmit = React.useCallback(() => {
      const trimmedValue = value.trim();
      onSubmit({
        input: trimmedValue,
        documentSearchActive,
        getAdjustments,
        submitType: 'default',
        setAdjustments,
        attachments,
      });
      clearAttachments();
      setSuggestionsFlyoutIsOpen(false);
      inputRef.current?.blur();
    }, [
      value,
      onSubmit,
      documentSearchActive,
      getAdjustments,
      setAdjustments,
      attachments,
      clearAttachments,
    ]);

    const handlePaste = React.useMemo(() => {
      if (!isOpen) {
        return undefined;
      }

      return onPaste;
    }, [isOpen, onPaste]);

    const handleClear = React.useCallback(() => {
      onChange('');
      onClear?.();
      setSuggestionsFlyoutIsOpen(false);
    }, [onChange, onClear]);

    const onFocusImpl = React.useCallback(() => {
      onFocus?.();
      typingTelemetryHelper.startSession();
    }, [onFocus, typingTelemetryHelper]);

    const onBlurImpl = React.useCallback(() => {
      typingTelemetryHelper.finishSession();
    }, [typingTelemetryHelper]);

    const deferredInputValue = React.useDeferredValue(value);

    // A new object created during rendering and immediately passed to useDeferredValue will be different
    // on every render, causing unnecessary background re-renders. useMemo is used to avoid this.
    const adjustments = React.useMemo(() => {
      if (!isOpen && layout === 'relaxed') {
        return undefined;
      }

      return renderAdjustments?.({
        isOffline,
        getAdjustments,
        setAdjustments,
        attachments,
        deferredInputValue,
        setInputState: setInputValue,
        layout,
      });
    }, [
      attachments,
      deferredInputValue,
      getAdjustments,
      isOffline,
      isOpen,
      renderAdjustments,
      setAdjustments,
      setInputValue,
      layout,
    ]);

    const disableWonderBoxDeferredAdjustments = featureFlag<boolean>(
      'home2DisableWonderBoxDeferredAdjustments',
      false,
    );

    const deferredAdjustments = React.useDeferredValue(adjustments);
    const adjustmentsToRender = disableWonderBoxDeferredAdjustments
      ? adjustments
      : deferredAdjustments;
    const adjustmentsIsDeferred = adjustmentsToRender !== adjustments;

    const deferredAttachmentUploaderNode = React.useDeferredValue(attachmentUploader);

    const suspensefulAdjustments =
      adjustmentsToRender != null ? (
        <React.Suspense fallback={<WonderBoxTabLoadingState />}>
          {adjustmentsToRender}
        </React.Suspense>
      ) : undefined;

    const handleOutsideInputInteraction = React.useCallback(() => {
      setSuggestionsFlyoutIsOpen(false);
    }, []);

    const outerContainerRef = React.useRef<HTMLDivElement>(null);
    const innerContainerRef = React.useRef<HTMLDivElement>(null);

    const isSmallScreen = useResponsiveValue({ default: true, smallUp: false });

    React.useLayoutEffect(() => {
      if (!outerContainerRef.current) {
        return;
      }
      const { width, height } = outerContainerRef.current.getBoundingClientRect();

      if (isOpen) {
        inputDimensionsRef.current.open = { width, height };
      } else {
        inputDimensionsRef.current.closed = { width, height };
      }

      if (isSmallScreen) {
        return;
      }

      const { outerContainerAnimation, innerContainerAnimation } = animateExpandCollapse(
        isOpen,
        inputDimensionsRef,
        outerContainerRef,
        innerContainerRef,
        setIsToggling,
      );

      return () => {
        outerContainerAnimation?.cancel();
        innerContainerAnimation?.finish();
        innerContainerAnimation?.cancel();
      };
    }, [inputDimensionsRef, isOpen, setIsToggling, isSmallScreen]);

    const wonderBoxFormPropsToDefer = React.useMemo<
      Pick<React.ComponentProps<typeof WonderBoxForm>, 'isOffline' | 'isVoiceInputActive' | 'role'>
    >(
      () => ({
        isOffline,
        isVoiceInputActive,
        role: formRole,
      }),
      [formRole, isOffline, isVoiceInputActive],
    );

    const deferredWonderBoxFormProps = React.useDeferredValue(wonderBoxFormPropsToDefer);

    const suggestionsIsEnabled = renderSuggestions != null;
    const { element: suggestions, isDeferred: suggestionsIsDeferred } =
      isOpen && !isToggling && suggestionsFlyoutIsOpen && suggestionsIsEnabled
        ? renderSuggestions({
            getSessionId,
            isOffline,
            query: value,
            deferredQuery: deferredInputValue,
            handleRef: suggestionsHandleRef,
            onSelect: handleSuggestionSelect,
          })
        : { element: undefined, isDeferred: false };

    // Note. This handler is only applied to the TextInput
    const handleTextInputClick = React.useCallback(() => {
      onTextInputClick?.();
      if (isOpen && suggestionsIsEnabled && value?.trim().length > 0) {
        setSuggestionsFlyoutIsOpen(true);
      }
    }, [isOpen, onTextInputClick, suggestionsIsEnabled, value]);

    const handleChange = React.useCallback(
      (newValue: string) => {
        onChange(newValue);

        if (suggestionsIsEnabled && newValue.trim().length > 0) {
          setSuggestionsFlyoutIsOpen(true);
        } else {
          setSuggestionsFlyoutIsOpen(false);
        }
      },
      [onChange, suggestionsIsEnabled],
    );

    return (
      <WonderBoxForm
        {...deferredWonderBoxFormProps}
        handleSubmit={handleSubmit}
        formState={formSubmitState}
      >
        {suspensefulAdjustments && layout === 'compact-inverted' && (
          <Box
            className={classNames({ [styles.deferred]: adjustmentsIsDeferred })}
            paddingX="0"
            paddingY="1.5u"
          >
            {suspensefulAdjustments}
          </Box>
        )}
        <Box
          ref={outerContainerRef}
          className={classNames(styles.container, styles.outerAnimationContainer, {
            [styles.isOpen]: isOpen,
            [styles.containerDefault]: !isOpen,
            [styles.containerGradient]: isOpen && palette === 'gradient',
            [styles.containerSolid]: isOpen && palette === 'solid',
            [styles.hoverDisabled]: isToggling,
            [styles.inputRevealAnimation]: enableRevealAnimation,
          })}
        >
          <WonderBoxDropzone isEnabled={isOpen && enableDropzone} addAttachment={addAttachment}>
            <Box className={isToggling && styles.overflowHidden}>
              <Box ref={innerContainerRef} className={styles.innerAnimationContainer}>
                <Box paddingX="1.5u" paddingY="2u">
                  <OutsidePointerDownHandler onOutsidePointerDown={handleOutsideInputInteraction}>
                    <div>
                      {isVoiceInputActive && <WonderBoxVoiceInput query={value} />}
                      <WonderBoxInputField
                        setRef={setRef}
                        keyHandlerRef={keyHandlerRef}
                        isOpen={isOpen}
                        suggestionsFlyoutIsOpen={suggestionsFlyoutIsOpen}
                        value={value}
                        disabled={isOffline}
                        isVoiceInputActive={isVoiceInputActive}
                        onChange={handleChange}
                        onClick={handleTextInputClick}
                        onFocus={onFocusImpl}
                        onBlur={onBlurImpl}
                        onPaste={handlePaste}
                        onClear={handleClear}
                        placeholder={placeholder}
                        maxLength={maxLength}
                        elementType={inputElementType ?? 'text'}
                      />
                      {suggestions != null && (
                        <Box
                          background="surface"
                          border="standard"
                          className={styles.suggestionsFlyout}
                        >
                          <div
                            className={classNames(styles.suggestionsFlyoutContent, {
                              [styles.deferred]: suggestionsIsDeferred,
                            })}
                          >
                            <Divider />
                            <React.Suspense fallback={null}>{suggestions}</React.Suspense>
                          </div>
                        </Box>
                      )}
                    </div>
                  </OutsidePointerDownHandler>
                  {isOpen && attachmentCards && (
                    <>
                      <Spacer size="0.5u" />
                      {attachmentCards}
                    </>
                  )}
                  {isOpen && (
                    <div
                      className={classNames({
                        [styles.hiddenContent]: suggestionsFlyoutIsOpen,
                      })}
                    >
                      <Spacer size="2u" />
                      <Columns alignY="start" spacing="1u">
                        <Column width="fluid">{deferredAttachmentUploaderNode}</Column>
                        {showDocumentSearchControl && (
                          <Column width="content">
                            <DocumentSearchToggleButton
                              active={documentSearchActive}
                              onClick={toggleDocumentSearch}
                            />
                          </Column>
                        )}
                        {(voiceInputButtonState !== 'hidden' || isVoiceInputActive)
                          && WonderBoxVoiceInputButton && (
                            <Column width="content">
                              <WonderBoxVoiceInputButton
                                getSessionId={getSessionId}
                                setQuery={setInputValue}
                                disabled={voiceInputButtonState === 'disabled'}
                              />
                            </Column>
                          )}
                        {hideSubmitButton ? (
                          <Box padding="0.5u">
                            <Spacer size="4u" />
                          </Box>
                        ) : (
                          <WonderBoxSubmitButton />
                        )}
                      </Columns>
                    </div>
                  )}
                </Box>
                {isOpen
                  && !isVoiceInputActive
                  && suspensefulAdjustments
                  && layout === 'relaxed' && (
                    <Box
                      className={classNames(styles.footerAdjustments, {
                        [styles.footerAdjustmentsGradient]: palette === 'gradient',
                        [styles.hiddenContent]: suggestionsFlyoutIsOpen,
                        [styles.deferred]: adjustmentsIsDeferred,
                      })}
                      paddingX="1.5u"
                      paddingY="1u"
                    >
                      <div className={styles.footerAdjustmentsContent}>
                        {suspensefulAdjustments}
                      </div>
                    </Box>
                  )}
              </Box>
            </Box>
            <WonderBoxBackgrounds />
          </WonderBoxDropzone>
        </Box>
        {suspensefulAdjustments && layout === 'compact' && (
          <Box
            className={classNames({ [styles.deferred]: adjustmentsIsDeferred })}
            paddingX="0"
            paddingY="1.5u"
          >
            {suspensefulAdjustments}
          </Box>
        )}
      </WonderBoxForm>
    );
  },
);

function WonderBoxBackgrounds() {
  /**
   * To smoothly transition between Wonder Box's visual states, we create HTML
   * elements for each visual state and cross-fade opacity between them. It
   * triggers repaint to use CSS transitions on colors, background
   * images/gradients, and box-shadows, so we create separate elements for each
   * and only transition opacity. This is sometimes handled with CSS
   * pseudo-elements, but because we have >2 states we need to use actual DOM
   * elements.
   */
  return (
    <>
      <div className={classNames(styles.containerBackground, styles.containerBackgroundBase)} />
      <div
        className={classNames(
          styles.containerBackground,
          styles.containerBackgroundGradientDefault,
        )}
      />
      <div
        className={classNames(styles.containerBackground, styles.containerBackgroundGradientMuted)}
      />
      <div
        className={classNames(styles.containerBackground, styles.containerBackgroundGradientActive)}
      />
      <div
        className={classNames(styles.containerBackground, styles.containerBackgroundGradientBold)}
      />
      <div className={classNames(styles.containerBackground, styles.containerBackgroundSolid)} />
      <div
        className={classNames(styles.containerBackground, styles.containerBackgroundSolidActive)}
      />
    </>
  );
}

type WonderBoxInputFieldProps = {
  setRef: (ref: WonderBoxInputRef) => void;
  keyHandlerRef: ReturnType<typeof useKeyCombinationHandler>['ref'];
  isOpen: boolean;
  elementType: 'text' | 'multiline';
  onClear: () => void;
  placeholder: string | undefined;
  maxLength: number | undefined;
  suggestionsFlyoutIsOpen: boolean;
  value: string;
  disabled: boolean;
  isVoiceInputActive: boolean;
  onChange: (value: string) => void;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onPaste?: (e: React.ClipboardEvent) => void;
};

type WonderBoxInputRef = HTMLInputElement | HTMLTextAreaElement | null;

function WonderBoxInputField({
  setRef,
  keyHandlerRef,
  isOpen,
  suggestionsFlyoutIsOpen,
  value,
  disabled,
  isVoiceInputActive,
  onChange,
  onClick,
  onFocus,
  onBlur,
  onPaste,
  onClear,
  maxLength,
  elementType,
  placeholder,
}: WonderBoxInputFieldProps) {
  // placeholders can be long enough to wrap on mobile
  const multiLineInputBufferRows = useResponsiveValue({ default: 1, smallUp: 0 });
  const wonderBoxFormContext = Preconditions.checkExists(
    React.useContext(WonderBoxFormContext),
    'WonderBoxInputField must be rendered inside a WonderBoxForm',
  );

  const onMultilineKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // Override adding a newline to the textarea
        event.preventDefault();
        if (wonderBoxFormContext.onSubmit) {
          wonderBoxFormContext.onSubmit();
        }
      }
    },
    [wonderBoxFormContext],
  );

  const textInput = (
    <Bleed x="0.5u">
      <TextInput
        ref={composeRefs<HTMLInputElement>(keyHandlerRef, (inputRef: HTMLInputElement) =>
          setRef(inputRef),
        )}
        type="search"
        className={classNames(styles.input, styles.textInput, {
          [styles.inputWithSuggestions]: suggestionsFlyoutIsOpen,
        })}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onClick={onClick}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onPaste={onPaste}
        start={isOpen ? <SearchIcon /> : <MagicSearchColorIcon />}
        end={
          !isOpen ? (
            <Box background="neutral" borderRadius="elementRound" padding="0.5u">
              <ArrowRightIcon tone="secondary" size="medium" />
            </Box>
          ) : value ? (
            <CircleButton
              icon={XIcon}
              iconSize="tiny"
              ariaLabel={WonderBoxInputMessages.clear()}
              onClick={() => onClear()}
              disabled={disabled}
              variant="contrast"
              size="tiny"
            />
          ) : undefined
        }
        borderless={true}
        maxLength={maxLength}
      />
    </Bleed>
  );

  switch (elementType) {
    case 'text':
      return textInput;
    case 'multiline':
      return (
        <MultilineInput
          ref={composeRefs<HTMLTextAreaElement>(keyHandlerRef, (textAreaRef: HTMLTextAreaElement) =>
            setRef(textAreaRef),
          )}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={onChange}
          onFocus={onFocus}
          onClick={onClick}
          onBlur={onBlur}
          onPaste={onPaste}
          borderless={true}
          autoGrow={true}
          footer={
            !isOpen && (
              <div className={styles.multilineInputFooter}>
                <Box background="neutral" borderRadius="elementRound" padding="0.5u">
                  <ArrowRightIcon tone="secondary" size="medium" />
                </Box>
              </div>
            )
          }
          maxRows={!isOpen ? 1 : 10}
          bufferRows={multiLineInputBufferRows}
          maxLength={maxLength}
          onKeyDown={onMultilineKeyDown}
          inputClassName={classNames(styles.multilineInput, {
            [styles.withFooter]: !isOpen,
          })}
          className={classNames(styles.input, {
            [styles.hiddenContent]: isVoiceInputActive,
          })}
        />
      );
    default:
      throw new UnreachableError(elementType);
  }
}

function WonderBoxVoiceInput({ query }: { query: string }) {
  const horizontalScrollableRef = React.useRef<ScrollableRef>(null);

  const scrollToEnd = (ref: React.RefObject<ScrollableRef | null>) => {
    const element = ref.current;
    if (!element) {
      return;
    }
    element.scrollTo({ position: 'end', behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToEnd(horizontalScrollableRef);
  }, [horizontalScrollableRef, query]);

  return (
    <Box className={styles.voiceInputContainer}>
      <Scrollable direction="vertical" ref={horizontalScrollableRef}>
        <TextFadeIn
          transcript={query.length > 0 ? query : WonderBoxVoiceInputMessages.imListening()}
        />
      </Scrollable>
    </Box>
  );
}

function easeInOutQuart(x: number) {
  return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function animateExpandCollapse(
  isOpen: boolean,
  inputDimensionsRef: React.MutableRefObject<{
    open: { width: number; height: number } | null;
    closed: { width: number; height: number } | null;
  }>,
  outerContainerRef: React.RefObject<HTMLDivElement | null>,
  innerContainerRef: React.RefObject<HTMLDivElement | null>,
  setIsToggling: (isToggling: boolean) => void,
): {
  outerContainerAnimation: Animation | null;
  innerContainerAnimation: Animation | null;
} {
  const { open, closed } = inputDimensionsRef.current;

  // Animation.finished and HTMLElement.animate are not supported in all our target browsers
  // So just skip the animation rather than crashing the page
  if (
    !open
    || !closed
    || !globalThis.Animation
    || !('finished' in globalThis.Animation.prototype)
    || !('animate' in globalThis.HTMLElement.prototype)
  ) {
    return { outerContainerAnimation: null, innerContainerAnimation: null };
  }

  const widthCollapse = closed.width / open.width;
  const heightCollapse = closed.height / open.height;

  const widthExpansion = 1 / widthCollapse;
  const heightExpansion = 1 / heightCollapse;

  const outerContainerKeyframes = [];
  const innerContainerKeyframes = [];

  const startWidthScale = isOpen ? widthCollapse : widthExpansion;
  const startHeightScale = isOpen ? heightCollapse : heightExpansion;

  for (let i = 0; i <= 100; i++) {
    const progress = easeInOutQuart(i / 100);

    const currentWidthScale = startWidthScale + (1 - startWidthScale) * progress;
    const currentHeightScale = startHeightScale + (1 - startHeightScale) * progress;

    outerContainerKeyframes.push({
      transform: `scaleX(${currentWidthScale}) scaleY(${currentHeightScale})`,
    });

    innerContainerKeyframes.push({
      transform: `scaleX(${1 / currentWidthScale}) scaleY(${1 / currentHeightScale})`,
    });
  }

  setIsToggling(true);

  const outerContainerAnimation =
    // @ts-expect-error [enhanced-typechecking] @typescript/lib-dom violation, see https://canv.am/api-compat for more details
    outerContainerRef.current?.animate(outerContainerKeyframes, {
      duration: transitionDuration,
      easing: 'linear',
    }) || null;

  const innerContainerAnimation =
    // @ts-expect-error [enhanced-typechecking] @typescript/lib-dom violation, see https://canv.am/api-compat for more details
    innerContainerRef.current?.animate(innerContainerKeyframes, {
      duration: transitionDuration,
      easing: 'linear',
    }) || null;

  // @ts-expect-error [enhanced-typechecking] @typescript/lib-dom violation, see https://canv.am/api-compat for more details
  innerContainerAnimation?.finished.then(() => {
    setIsToggling(false);
  });
  return { outerContainerAnimation, innerContainerAnimation };
}

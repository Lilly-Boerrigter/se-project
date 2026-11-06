import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS, styles } from "../styles/splash-page.styles";
import React from "react";

type Props = {
  isLoading?: boolean;
  onSearch?: (keywords: string[]) => void; // receives the cleaned keyword list
  onHistory?: () => void;
};

export default function SplashPage({
  isLoading = false,
  onSearch,
  onHistory,
}: Props) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Turns the current draft text into a chip (comma or Enter triggers this).
  const commitDraft = (text: string = draft) => {
    const word = text.trim().toLowerCase();
    if (word && !keywords.includes(word)) {
      setKeywords((prev) => [...prev, word]);
    }
    setDraft("");
  };

  const handleChangeText = (text: string) => {
    if (text.includes(",")) {
      // Supports typing "a, b," or pasting "a, b, c" in one go.
      const parts = text.split(",");
      const last = parts.pop() ?? "";
      parts.forEach((p) => commitDraft(p));
      setDraft(last);
    } else {
      setDraft(text);
    }
  };

  const removeKeyword = (word: string) =>
    setKeywords((prev) => prev.filter((k) => k !== word));

  const handleSearch = () => {
    const finalList = draft.trim()
      ? [...keywords, draft.trim().toLowerCase()]
      : keywords;
    const unique = Array.from(new Set(finalList));
    if (unique.length === 0 || isLoading) return;
    setKeywords(unique);
    setDraft("");
    inputRef.current?.blur();
    Keyboard.dismiss();
    console.log("search pressed", unique, "onSearch is", typeof onSearch);
    onSearch?.(unique);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          style={styles.container}
          onPress={() => {
            inputRef.current?.blur();
            Keyboard.dismiss();
          }}
        >
          {/* Brand */}
          <View style={styles.brand}>
            <Ionicons name="book-outline" size={22} color={COLORS.navy} />
          </View>

          {/* Heading */}
          <View style={styles.hero}>
            <Text style={styles.title}>
              Find the data behind your research.
            </Text>
            <Text style={styles.subtitle}>
              A few keywords. A curated set of web databases.
            </Text>

            {/* Keyword chip input */}
            <Pressable
              style={styles.inputBox}
              onPress={(event) => {
                event.stopPropagation();
                inputRef.current?.focus();
              }}
              accessibilityRole="none"
            >
              {keywords.map((word) => (
                <View key={word} style={styles.chip}>
                  <Text style={styles.chipText}>{word}</Text>
                  <Pressable
                    onPress={() => removeKeyword(word)}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${word}`}
                  >
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={COLORS.navy}
                    />
                  </Pressable>
                </View>
              ))}
              <View style={styles.inputPill}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={draft}
                  onChangeText={handleChangeText}
                  onSubmitEditing={() => commitDraft()}
                  onFocus={() => setKeyboardVisible(true)}
                  onBlur={() => setKeyboardVisible(false)}
                  placeholder="Type a keyword"
                  placeholderTextColor={COLORS.muted}
                  returnKeyType="done"
                  blurOnSubmit
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                  accessibilityLabel="Keyword"
                />
                <Text style={styles.inputHint}>, / Enter</Text>
              </View>
            </Pressable>
            <Text style={styles.note}>
              Order doesn't matter. Repeat searches load instantly from your
              device.
            </Text>

            {/* Actions, Search Button*/}
            <View style={styles.actions}>
              <Pressable
                style={[
                  styles.primaryBtn,
                  (isLoading || (keywords.length === 0 && !draft.trim())) &&
                    styles.btnDisabled,
                ]}
                onPress={handleSearch}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel="Search"
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons name="search" size={18} color={COLORS.white} />
                    <Text style={styles.primaryText}>Search</Text>
                  </>
                )}
              </Pressable>

              {/* 
              onSearch={(keywords) =>
        router.push({
          pathname: "/results",
          params: { keywords: keywords.join(",") },
        })
      } */}

              {/* History Button */}
              <Pressable
                style={styles.secondaryBtn}
                onPress={onHistory}
                accessibilityRole="button"
                accessibilityLabel="History"
              >
                <Ionicons name="time-outline" size={18} color={COLORS.navy} />
                <Text style={styles.secondaryText}>History</Text>
              </Pressable>
            </View>

            <Text style={styles.hint}>
              {isLoading
                ? "Loading..."
                : "Type a keyword, then press comma or Enter."}
            </Text>
          </View>

          {/* Footer */}
          {!keyboardVisible && (
            <View style={styles.footer}>
              <Text style={styles.footerLabel}>YOUR DATABASE DISCOVERY TOOL</Text>
              <Text style={styles.footerText}>
                Search web databases. Save sets. Ask AI questions.
              </Text>
            </View>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

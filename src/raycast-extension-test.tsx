// エラーあり！！！
// news  rss取得
import { Action, ActionPanel, List, open } from "@raycast/api";
import { useEffect, useState } from "react";
import { useFetch, Response, isLoading } from "@raycast/utils";
import { XMLParser } from "fast-xml-parser";
import Parser from "rss-parser";

const parser_hatena = new Parser();
const options = {
  ignoreAttributes: true,
};
interface State {
  items?: Parser.Item[];
  items_hatena?: Parser.Item[];
  error?: Error;
}

export default function Command() {
  const [state, setState] = useState<State>({});
  const { isLoading, data } = useFetch(
    "https://news.yahoo.co.jp/rss/topics/top-picks.xml"
  );
  const options = {
    ignoreAttributes: true,
  };
  const parser_yahoo = new XMLParser(options);
  const json = parser_yahoo.parse(data).rss;

  useEffect(() => {
    async function fetchStories() {
      let feed = await parser_hatena.parseURL("https://menthas.com/all/rss");
      let feed_hatena = await parser_hatena.parseURL(
        "https://b.hatena.ne.jp/hotentry/it.rss"
      );
      setState({ items: feed.items, items_hatena: feed_hatena.items });
    }
    fetchStories();
  }, []);

  return (
    <List>
      <List.Item
        title="menthas"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="menthas">
              {(state.items || []).map((item2) => (
                <Action
                  title={item2["title"]}
                  onAction={() => open(item2["link"])}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="hatenabu"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="hatenabu">
              {(state.items_hatena || []).map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
      <List.Item
        title="yahoo news"
        actions={
          <ActionPanel title="menu">
            <ActionPanel.Submenu title="yahoo news">
              {(json["channel"]["item"] || []).map((item) => (
                <Action
                  title={item["title"]}
                  onAction={() => open(item["link"])}
                />
              ))}
            </ActionPanel.Submenu>
          </ActionPanel>
        }
      />
    </List>
  );
}

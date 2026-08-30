import { shallowRef, watch } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import type { LocationQuery, LocationQueryRaw } from "vue-router";

export type UrlQueryCodec<QueryState> = {
  parse: (query: LocationQuery) => QueryState;
  serialize: (state: QueryState) => LocationQueryRaw;
};

export type UrlQueryState<QueryState> = {
  state: Ref<QueryState>;
  replace: (state: QueryState) => Promise<void>;
  push: (state: QueryState) => Promise<void>;
};

export function useUrlQuery<QueryState>(
  codec: UrlQueryCodec<QueryState>,
): UrlQueryState<QueryState> {
  const route = useRoute();
  const router = useRouter();
  const state: Ref<QueryState> = shallowRef(codec.parse(route.query));

  watch(
    () => route.query,
    (query) => {
      state.value = codec.parse(query);
    },
  );

  async function replace(nextState: QueryState): Promise<void> {
    await router.replace({ query: { ...route.query, ...codec.serialize(nextState) } });
  }

  async function push(nextState: QueryState): Promise<void> {
    await router.push({ query: { ...route.query, ...codec.serialize(nextState) } });
  }

  return { state, replace, push };
}

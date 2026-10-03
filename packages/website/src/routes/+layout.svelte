<script lang="ts">
  // import the library's global CSS here rather than relying on it arriving via
  // `simplyengineered`'s entry point. The build splits CSS per route, so a
  // stylesheet only reachable through a component import lands on one route and
  // the others render unstyled. The layout is shared, so importing it here
  // guarantees every page gets it.
  import 'simplyengineered/colors.css';
  import 'simplyengineered/main.css';

  let { children } = $props();
</script>

{@render children?.()}

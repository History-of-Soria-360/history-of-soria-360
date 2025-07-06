for file in *.glb; do
  gltf-transform optimize "$file" "${file%.glb}_optimized.glb"
done

